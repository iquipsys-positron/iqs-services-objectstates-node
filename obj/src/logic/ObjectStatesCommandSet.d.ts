import { CommandSet } from 'pip-services3-commons-node';
import { IObjectStatesController } from './IObjectStatesController';
export declare class ObjectStatesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IObjectStatesController);
    private makeGetStatesCommand;
    private makeGetTimelineStatesCommand;
    private makeAddStateCommand;
    private makeAddStatesCommand;
    private makeDeleteStatesCommand;
}
