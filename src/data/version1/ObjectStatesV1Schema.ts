import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { ObjectStateV1Schema } from './ObjectStateV1Schema';

export class ObjectStatesV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);
        this.withRequiredProperty('start_time', TypeCode.DateTime);
        this.withRequiredProperty('end_time', TypeCode.DateTime);
        this.withOptionalProperty('states', new ArraySchema(new ObjectStateV1Schema()));
    }
}
