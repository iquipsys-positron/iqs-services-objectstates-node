"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class ObjectStatesMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('object_states');
        super.ensureIndex({ org_id: 1, start_time: -1, end_time: -1 });
    }
    matchObject(state, objectId) {
        return state.object_id == objectId || state.assign_id == objectId;
    }
    matchObjects(state, objectIds) {
        return _.indexOf(objectIds, state.object_id) >= 0
            || _.indexOf(objectIds, state.assign_id) >= 0;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });
        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null) {
            criteria.push({
                $or: [
                    { "states.object_id": objectId },
                    { "states.assign_id": objectId }
                ]
            });
        }
        // Filter object ids
        let objectIds = filter.getAsObject('object_ids');
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (_.isArray(objectIds)) {
            criteria.push({
                $or: [
                    { "states.object_id": { $in: objectIds } },
                    { "states.assign_id": { $in: objectIds } }
                ]
            });
        }
        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ end_time: { $gte: fromTime } });
        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ start_time: { $lt: toTime } });
        return criteria.length > 0 ? { $and: criteria } : null;
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
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, "-start_time", null, this.filterResults(filter, callback));
    }
    addOne(correlationId, orgId, startTime, endTime, state, callback) {
        let filter = {
            org_id: orgId,
            start_time: { $lte: state.time },
            end_time: { $gt: state.time }
        };
        let newItem = {
            $push: { states: state },
            $setOnInsert: {
                _id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                org_id: orgId,
                start_time: startTime,
                end_time: endTime
            }
        };
        let options = {
            returnOriginal: false,
            upsert: true
        };
        this._collection.findOneAndUpdate(filter, newItem, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Added state for " + state.object_id + " at " + state.time);
            if (callback) {
                let newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }
    addBatch(correlationId, allStates, callback) {
        if (allStates == null || allStates.length == 0) {
            if (callback)
                callback(null);
            return;
        }
        let options = {
            upsert: true
        };
        let batch = this._collection.initializeUnorderedBulkOp();
        let count = 0;
        let operations = [];
        for (let states of allStates) {
            if (states.states && states.states.length > 0) {
                batch
                    .find({
                    org_id: states.org_id,
                    start_time: states.start_time,
                    end_time: states.end_time
                })
                    .upsert()
                    .updateOne({
                    $push: { states: { $each: states.states } },
                    $setOnInsert: {
                        _id: pip_services3_commons_node_2.IdGenerator.nextLong(),
                        org_id: states.org_id,
                        start_time: states.start_time,
                        end_time: states.end_time
                    }
                });
                count += states.states.length;
            }
        }
        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Added " + count + " states");
            if (callback)
                callback(err);
        });
    }
    deleteByFilter(correlationId, filter, callback) {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }
}
exports.ObjectStatesMongoDbPersistence = ObjectStatesMongoDbPersistence;
//# sourceMappingURL=ObjectStatesMongoDbPersistence.js.map