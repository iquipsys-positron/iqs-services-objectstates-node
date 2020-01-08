import { ObjectStateDataValueV1 } from './ObjectStateDataValueV1';
export declare class ObjectStateV1 {
    org_id: string;
    device_id: string;
    object_id: string;
    assign_id?: string;
    time: Date;
    pos?: any;
    alt?: number;
    angle?: number;
    speed?: number;
    expected?: boolean;
    connected?: boolean;
    online: number;
    offline?: number;
    immobile?: number;
    freezed?: number;
    pressed?: boolean;
    long_pressed?: boolean;
    power?: boolean;
    group_ids?: string[];
    zone_ids?: string[];
    params?: ObjectStateDataValueV1[];
    events?: ObjectStateDataValueV1[];
    commands?: ObjectStateDataValueV1[];
    states?: ObjectStateDataValueV1[];
    extra?: any;
}
