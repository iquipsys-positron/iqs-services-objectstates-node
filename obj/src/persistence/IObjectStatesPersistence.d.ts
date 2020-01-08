import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
export interface IObjectStatesPersistence extends IGetter<ObjectStatesV1, string>, IWriter<ObjectStatesV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectStatesV1>) => void): void;
    addOne(correlationId: string, orgId: string, startTime: Date, endTime: Date, state: ObjectStateV1, callback: (err: any, item: ObjectStatesV1) => void): void;
    addBatch(correlationId: string, states: ObjectStatesV1[], callback: (err: any) => void): void;
    update(correlationId: string, item: ObjectStatesV1, callback: (err: any, item: ObjectStatesV1) => void): void;
    deleteByFilter(correlationId: string, filter: FilterParams, callback: (err: any) => void): void;
}
