import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { ObjectStateDataValueV1Schema } from './ObjectStateDataValueV1Schema';

export class ObjectStateV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('device_id', TypeCode.String);
        this.withOptionalProperty('object_id', TypeCode.String);
        this.withOptionalProperty('assign_id', TypeCode.String);

        this.withRequiredProperty('time', TypeCode.DateTime);
        this.withOptionalProperty('pos', null); // GeoJSON
        this.withOptionalProperty('alt', TypeCode.Float);
        this.withOptionalProperty('angle', TypeCode.Float);
        this.withOptionalProperty('speed', TypeCode.Float);

        this.withOptionalProperty('expected', TypeCode.Boolean);
        this.withOptionalProperty('connected', TypeCode.Boolean);
        this.withRequiredProperty('online', TypeCode.Long);
        this.withOptionalProperty('offline', TypeCode.Long);
        this.withOptionalProperty('immobile', TypeCode.Long);
        this.withOptionalProperty('freezed', TypeCode.Long);
        this.withOptionalProperty('pressed', TypeCode.Boolean);
        this.withOptionalProperty('long_pressed', TypeCode.Boolean);
        this.withOptionalProperty('power', TypeCode.Boolean);

        this.withOptionalProperty('group_ids', new ArraySchema(TypeCode.String));
        this.withOptionalProperty('zone_ids', new ArraySchema(TypeCode.String));

        this.withOptionalProperty('params', new ArraySchema(new ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('events', new ArraySchema(new ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('commands', new ArraySchema(new ObjectStateDataValueV1Schema()));
        this.withOptionalProperty('states', new ArraySchema(new ObjectStateDataValueV1Schema()));

        this.withOptionalProperty('extra', null);
    }
}
