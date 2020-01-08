import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStateV1Schema } from '../data/version1/ObjectStateV1Schema';
import { IObjectStatesController } from './IObjectStatesController';

export class ObjectStatesCommandSet extends CommandSet {
    private _logic: IObjectStatesController;

    constructor(logic: IObjectStatesController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetStatesCommand());
		this.addCommand(this.makeGetTimelineStatesCommand());
		this.addCommand(this.makeAddStateCommand());
		this.addCommand(this.makeAddStatesCommand());
		this.addCommand(this.makeDeleteStatesCommand());
    }

	private makeGetStatesCommand(): ICommand {
		return new Command(
			"get_states",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getStates(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetTimelineStatesCommand(): ICommand {
		return new Command(
			"get_timeline_states",
			new ObjectSchema(true)
				.withRequiredProperty('time', null) // TypeCode.DateTime)
				.withOptionalProperty('filter', new FilterParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				let time = args.getAsNullableDateTime("time");
                let filter = FilterParams.fromValue(args.get("filter"));
                this._logic.getTimelineStates(correlationId, time, filter, callback);
            }
		);
	}

	private makeAddStateCommand(): ICommand {
		return new Command(
			"add_state",
			new ObjectSchema(true)
				.withRequiredProperty('state', new ObjectStateV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let state = args.get("state");
                this._logic.addState(correlationId, state, (err) => {
					callback(err, null);
				});
            }
		);
	}

	private makeAddStatesCommand(): ICommand {
		return new Command(
			"add_states",
			new ObjectSchema(true)
				.withRequiredProperty('states', new ArraySchema(new ObjectStateV1Schema())),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let states = args.get("states");
                this._logic.addStates(correlationId, states, (err) => {
					callback(err, null);
				});
            }
		);
	}
	
	private makeDeleteStatesCommand(): ICommand {
		return new Command(
			"delete_states",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                this._logic.deleteStates(correlationId, filter, (err) => { 
					if (callback) callback(err, null);
				});
			}
		);
	}

}