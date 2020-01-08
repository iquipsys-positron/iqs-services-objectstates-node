import { IStringIdentifiable } from 'pip-services3-commons-node';
import { ObjectStateV1 } from './ObjectStateV1';

export class ObjectStatesV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;
    public start_time: Date;
    public end_time: Date;
    public states: ObjectStateV1[];
}
