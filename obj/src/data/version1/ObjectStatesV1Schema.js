"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ObjectStateV1Schema_1 = require("./ObjectStateV1Schema");
class ObjectStatesV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('start_time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withRequiredProperty('end_time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('states', new pip_services3_commons_node_2.ArraySchema(new ObjectStateV1Schema_1.ObjectStateV1Schema()));
    }
}
exports.ObjectStatesV1Schema = ObjectStatesV1Schema;
//# sourceMappingURL=ObjectStatesV1Schema.js.map