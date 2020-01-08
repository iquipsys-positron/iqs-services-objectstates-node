"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class ObjectStatesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    matchObject(state, objectId) {
        return state.object_id == objectId || state.assign_id == objectId;
    }
    matchObjects(state, objectIds) {
        return _.indexOf(objectIds, state.object_id) >= 0
            || _.indexOf(objectIds, state.assign_id) >= 0;
    }
    containsObject(states, objectId) {
        return _.some(states, s => this.matchObject(s, objectId));
    }
    containsObjects(states, objectIds) {
        return _.some(states, s => this.matchObjects(s, objectIds));
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let objectId = filter.getAsNullableString('object_id');
        let orgId = filter.getAsNullableString('org_id');
        let objectIds = filter.getAsObject('object_ids');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        // Process ids filter
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (!_.isArray(objectIds))
            objectIds = null;
        return (item) => {
            if (orgId && item.org_id != orgId)
                return false;
            if (fromTime && item.end_time.getTime() < fromTime.getTime())
                return false;
            if (toTime && item.start_time.getTime() >= toTime.getTime())
                return false;
            if (objectId && !this.containsObject(item.states, objectId))
                return false;
            if (objectIds && !this.containsObjects(item.states, objectIds))
                return false;
            return true;
        };
    }
    filterResults(filter, callback) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let objectId = filter.getAsNullableString('object_id');
        let objectIds = filter.getAsObject('object_ids');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        return (err, page) => {
            // Skip when error occured
            if (err != null || page == null) {
                callback(err, page);
                return;
            }
            // Filter out all elements without object id
            for (let item of page.data) {
                if (objectId != null)
                    item.states = _.filter(item.states, s => this.matchObject(s, objectId));
                if (objectIds != null)
                    item.states = _.filter(item.states, s => this.matchObjects(s, objectIds));
                if (fromTime != null)
                    item.states = _.filter(item.states, s => s.time >= fromTime);
                if (toTime != null)
                    item.states = _.filter(item.states, s => s.time < toTime);
            }
            callback(err, page);
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, this.filterResults(filter, callback));
    }
    addOne(correlationId, orgId, startTime, endTime, state, callback) {
        let item = this._items.find((x) => {
            return x.org_id == orgId
                && x.start_time <= state.time
                && x.end_time > state.time;
        });
        if (item == null) {
            item = {
                id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                org_id: orgId,
                start_time: startTime,
                end_time: endTime,
                states: []
            };
            this._items.push(item);
        }
        item.states = item.states || [];
        item.states.push(state);
        this._logger.trace(correlationId, "Added state for " + state.object_id + " at " + state.time);
        this.save(correlationId, (err) => {
            if (callback)
                callback(err, item);
        });
    }
    addBatch(correlationId, allStates, callback) {
        let count = 0;
        for (let states of allStates) {
            let item = this._items.find((x) => {
                return x.org_id == states.org_id
                    && x.start_time.getTime() == states.start_time.getTime()
                    && x.end_time.getTime() == states.end_time.getTime();
            });
            if (item == null) {
                item = {
                    id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                    org_id: states.org_id,
                    start_time: states.start_time,
                    end_time: states.end_time,
                    states: []
                };
                this._items.push(item);
            }
            item.states = item.states || [];
            for (let state of states.states) {
                item.states.push(state);
                count++;
            }
        }
        this._logger.trace(correlationId, "Added " + count + " states");
        this.save(correlationId, (err) => {
            if (callback)
                callback(err);
        });
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.ObjectStatesMemoryPersistence = ObjectStatesMemoryPersistence;
//# sourceMappingURL=ObjectStatesMemoryPersistence.js.map