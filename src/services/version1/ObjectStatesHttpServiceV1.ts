import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class ObjectStatesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/object_states');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-objectstates', 'controller', 'default', '*', '1.0'));
    }
}