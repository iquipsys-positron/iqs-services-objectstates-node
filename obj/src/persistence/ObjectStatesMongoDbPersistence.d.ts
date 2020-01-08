import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
import { IObjectStatesPersistence } from './IObjectStatesPersistence';
export declare class ObjectStatesMongoDbPersistence extends IdentifiableMongoDbPersistence<ObjectStatesV1, string> implements IObjectStatesPersistence {
    constructor();
    private matchObject;
    private matchObjects;
    private composeFilter;
    private filterResults;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectStatesV1>) => void): void;
    addOne(correlationId: string, orgId: string, startTime: Date, endTime: Date, state: ObjectStateV1, callback: (err: any, item: ObjectStatesV1) => void): void;
    addBatch(correlationId: string, allStates: ObjectStatesV1[], callback: (err: any) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
