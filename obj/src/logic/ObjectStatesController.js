"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const ObjectStatesCommandSet_1 = require("./ObjectStatesCommandSet");
class ObjectStatesController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(ObjectStatesController._defaultConfig);
        this._intervalMin = 15; // in minutes
        this._interval = this._intervalMin * 60000; // in msecs
    }
    configure(config) {
        this._dependencyResolver.configure(config);
        this._intervalMin = config.getAsLongWithDefault('options.interval', this._intervalMin);
        this._interval = this._intervalMin * 60000;
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new ObjectStatesCommandSet_1.ObjectStatesCommandSet(this);
        return this._commandSet;
    }
    getStates(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getTimelineStates(correlationId, time, filter, callback) {
        // By default take current time
        time = pip_services3_commons_node_5.DateTimeConverter.toDateTimeWithDefault(time, new Date());
        // Start from online timeout
        let fromTime = new Date(time.getTime() - this._interval);
        // End with 1 sec ahead of specified timeline
        let toTime = new Date(time.getTime() + 1000);
        // Update filter
        filter = pip_services3_commons_node_3.FilterParams.fromValue(filter);
        filter.setAsObject('from_time', fromTime);
        filter.setAsObject('to_time', toTime);
        let pages = 0;
        let skip = 0;
        let take = 1000;
        let reading = true;
        let result = [];
        // Read several pages
        async.doWhilst((callback) => {
            // Read a page
            this._persistence.getPageByFilter(correlationId, filter, new pip_services3_commons_node_4.PagingParams(skip, take, false), (err, page) => {
                pages++;
                skip += take;
                // Give small slack for a page
                reading = pages < 10 && page != null && page.data.length > (take - 3);
                // Append states to the list. Take the latest for each object
                if (page != null) {
                    for (let states of page.data) {
                        for (let state of states.states) {
                            // Todo: Shall we consider assigned objects here?
                            let pos = _.findIndex(result, (s) => s.object_id == state.object_id);
                            if (pos < 0)
                                result.push(state);
                            else if (result[pos].time.getTime() < state.time.getTime())
                                result[pos] = state;
                        }
                    }
                }
                callback(err);
            });
        }, () => reading, (err) => {
            callback(err, err == null ? result : null);
        });
    }
    fixState(state) {
        if (_.isString(state.pos))
            state.pos = JSON.parse(state.pos);
        state.time = pip_services3_commons_node_5.DateTimeConverter.toDateTimeWithDefault(state.time, new Date());
    }
    calculateStartTime(time) {
        let year = time.getUTCFullYear();
        let month = time.getUTCMonth();
        let day = time.getUTCDate();
        let hour = time.getUTCHours();
        let min = time.getUTCMinutes();
        let sec = time.getUTCSeconds();
        let msec = time.getUTCMilliseconds();
        let dayStartUtc = Date.UTC(year, month, day);
        let timeUtc = Date.UTC(year, month, day, hour, min, sec, msec);
        let offset = timeUtc - dayStartUtc;
        offset = offset - (offset % this._interval);
        return new Date(dayStartUtc + offset);
    }
    addState(correlationId, state, callback) {
        this.fixState(state);
        let startTime = this.calculateStartTime(state.time);
        let endTime = new Date(startTime.getTime() + this._interval);
        this._persistence.addOne(correlationId, state.org_id, startTime, endTime, state, (err, states) => {
            if (callback)
                callback(err);
        });
    }
    addStates(correlationId, states, callback) {
        let allStates = [];
        // Package states
        for (let state of states) {
            this.fixState(state);
            let startTime = this.calculateStartTime(state.time);
            let thisStates = _.find(allStates, s => s.org_id == state.org_id
                && s.start_time.getTime() == startTime.getTime());
            if (thisStates == null) {
                let endTime = new Date(startTime.getTime() + this._interval);
                thisStates = {
                    org_id: state.org_id,
                    start_time: startTime,
                    end_time: endTime,
                    states: []
                };
                allStates.push(thisStates);
            }
            thisStates.states.push(state);
        }
        this._persistence.addBatch(correlationId, allStates, callback);
    }
    deleteStates(correlationId, filter, callback) {
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }
}
exports.ObjectStatesController = ObjectStatesController;
ObjectStatesController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-objectstates:persistence:*:*:1.0');
//# sourceMappingURL=ObjectStatesController.js.map