import { ObjectStateDataValueV1 } from './ObjectStateDataValueV1';

export class ObjectStateV1 {
    public org_id: string;
    public device_id: string;
    public object_id: string;
    public assign_id?: string;
    public time: Date;
    public pos?: any;
    public alt?: number;
    public angle?: number;
    public speed?: number;

    public expected?: boolean;
    public connected?: boolean;
    public online: number;
    public offline?: number;
    public immobile?: number;
    public freezed?: number;
    public pressed?: boolean;
    public long_pressed?: boolean;
    public power?: boolean;

    public group_ids?: string[];
    public zone_ids?: string[];

    public params?: ObjectStateDataValueV1[];
    public events?: ObjectStateDataValueV1[];
    public commands?: ObjectStateDataValueV1[];
    public states?: ObjectStateDataValueV1[];

    public extra?: any;
}