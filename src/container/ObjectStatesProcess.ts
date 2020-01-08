import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { ObjectStatesServiceFactory } from '../build/ObjectStatesServiceFactory';

export class ObjectStatesProcess extends ProcessContainer {

    public constructor() {
        super("object_states", "Object states microservice");
        this._factories.add(new ObjectStatesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }

}
