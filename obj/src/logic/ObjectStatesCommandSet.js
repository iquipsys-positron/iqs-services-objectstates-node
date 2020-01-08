"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const ObjectStateV1Schema_1 = require("../data/version1/ObjectStateV1Schema");
class ObjectStatesCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetStatesCommand());
        this.addCommand(this.makeGetTimelineStatesCommand());
        this.addCommand(this.makeAddStateCommand());
        this.addCommand(this.makeAddStatesCommand());
        this.addCommand(this.makeDeleteStatesCommand());
    }
    makeGetStatesCommand() {
        return new pip_services3_commons_node_2.Command("get_states", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getStates(correlationId, filter, paging, callback);
        });
    }
    makeGetTimelineStatesCommand() {
        return new pip_services3_commons_node_2.Command("get_timeline_states", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('time', null) // TypeCode.DateTime)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema()), (correlationId, args, callback) => {
            let time = args.getAsNullableDateTime("time");
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            this._logic.getTimelineStates(correlationId, time, filter, callback);
        });
    }
    makeAddStateCommand() {
        return new pip_services3_commons_node_2.Command("add_state", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('state', new ObjectStateV1Schema_1.ObjectStateV1Schema()), (correlationId, args, callback) => {
            let state = args.get("state");
            this._logic.addState(correlationId, state, (err) => {
                callback(err, null);
            });
        });
    }
    makeAddStatesCommand() {
        return new pip_services3_commons_node_2.Command("add_states", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('states', new pip_services3_commons_node_6.ArraySchema(new ObjectStateV1Schema_1.ObjectStateV1Schema())), (correlationId, args, callback) => {
            let states = args.get("states");
            this._logic.addStates(correlationId, states, (err) => {
                callback(err, null);
            });
        });
    }
    makeDeleteStatesCommand() {
        return new pip_services3_commons_node_2.Command("delete_states", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            this._logic.deleteStates(correlationId, filter, (err) => {
                if (callback)
                    callback(err, null);
            });
        });
    }
}
exports.ObjectStatesCommandSet = ObjectStatesCommandSet;
//# sourceMappingURL=ObjectStatesCommandSet.js.map