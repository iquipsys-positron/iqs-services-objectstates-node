import { IStringIdentifiable } from 'pip-services3-commons-node';
import { ObjectStateV1 } from './ObjectStateV1';
export declare class ObjectStatesV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    start_time: Date;
    end_time: Date;
    states: ObjectStateV1[];
}
