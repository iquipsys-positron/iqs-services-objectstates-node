import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { ObjectStatesMemoryPersistence } from './ObjectStatesMemoryPersistence';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
export declare class ObjectStatesFilePersistence extends ObjectStatesMemoryPersistence {
    protected _persister: JsonFilePersister<ObjectStatesV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
