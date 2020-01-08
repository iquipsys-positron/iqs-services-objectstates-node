import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class ObjectStateDataValueV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('id', TypeCode.Integer);
        this.withOptionalProperty('typ', TypeCode.Integer);
        this.withRequiredProperty('val', TypeCode.Float);
    }
}
