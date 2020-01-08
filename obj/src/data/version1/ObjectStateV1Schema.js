"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const ObjectStateDataValueV1Schema_1 = require("./ObjectStateDataValueV1Schema");
class ObjectStateV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('device_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('object_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('assign_id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('pos', null); // GeoJSON
        this.withOptionalProperty('alt', pip_services3_commons_node_3.TypeCode.Float);
        this.withOptionalProperty('angle', pip_services3_commons_node_3.TypeCode.Float);
        this.withOptionalProperty('speed', pip_services3_commons_node_3.TypeCode.Float);
        this.withOptionalProperty('expected', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withOptionalProperty('connected', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withRequiredProperty('online', pip_services3_commons_node_3.TypeCode.Long);
        this.withOptionalProperty('offline', pip_services3_commons_node_3.TypeCode.Long);
        this.withOptionalProperty('immobile', pip_services3_commons_node_3.TypeCode.Long);
        this.withOptionalProperty('freezed', pip_services3_commons_node_3.TypeCode.Long);
        this.withOptionalProperty('pressed', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withOptionalProperty('long_pressed', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withOptionalProperty('power', pip_services3_commons_node_3.TypeCode.Boolean);
        this.withOptionalProperty('group_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('zone_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withOptionalProperty('params', new pip_services3_commons_node_2.ArraySchema(new ObjectStateDataValueV1Schema_1.ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('events', new pip_services3_commons_node_2.ArraySchema(new ObjectStateDataValueV1Schema_1.ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('commands', new pip_services3_commons_node_2.ArraySchema(new ObjectStateDataValueV1Schema_1.ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('states', new pip_services3_commons_node_2.ArraySchema(new ObjectStateDataValueV1Schema_1.ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('extra', null);
    }
}
exports.ObjectStateV1Schema = ObjectStateV1Schema;
//# sourceMappingURL=ObjectStateV1Schema.js.map