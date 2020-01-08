import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
export interface IObjectStatesController {
    getStates(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ObjectStatesV1>) => void): void;
    getTimelineStates(correlationId: string, time: Date, filter: FilterParams, callback: (err: any, states: ObjectStateV1[]) => void): void;
    addState(correlationId: string, state: ObjectStateV1, callback?: (err: any) => void): void;
    addStates(correlationId: string, states: ObjectStateV1[], callback?: (err: any) => void): void;
    deleteStates(correlationId: string, filter: FilterParams, callback?: (err: any) => void): void;
}
