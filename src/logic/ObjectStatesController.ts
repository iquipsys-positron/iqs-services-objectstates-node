let _ = require('lodash');
let async = require('async');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
import { IObjectStatesPersistence } from '../persistence/IObjectStatesPersistence';
import { IObjectStatesController } from './IObjectStatesController';
import { ObjectStatesCommandSet } from './ObjectStatesCommandSet';

export class ObjectStatesController implements IConfigurable, IReferenceable, ICommandable, IObjectStatesController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-objectstates:persistence:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(ObjectStatesController._defaultConfig);
    private _persistence: IObjectStatesPersistence;
    private _commandSet: ObjectStatesCommandSet;
    private _intervalMin: number = 15; // in minutes
    private _interval: number = this._intervalMin * 60000; // in msecs

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);

        this._intervalMin = config.getAsLongWithDefault('options.interval', this._intervalMin);
        this._interval = this._intervalMin * 60000;
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IObjectStatesPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new ObjectStatesCommandSet(this);
        return this._commandSet;
    }

    public getStates(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ObjectStatesV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getTimelineStates(correlationId: string, time: Date, filter: FilterParams,
        callback: (err: any, states: ObjectStateV1[]) => void): void {

        // By default take current time
        time = DateTimeConverter.toDateTimeWithDefault(time, new Date());
        // Start from online timeout
        let fromTime = new Date(time.getTime() - this._interval);
        // End with 1 sec ahead of specified timeline
        let toTime = new Date(time.getTime() + 1000);

        // Update filter
        filter = FilterParams.fromValue(filter);
        filter.setAsObject('from_time', fromTime);
        filter.setAsObject('to_time', toTime);

        let pages = 0;
        let skip = 0;
        let take = 1000;
        let reading = true;

        let result: ObjectStateV1[] = [];

        // Read several pages
        async.doWhilst(
            (callback) => {
                // Read a page
                this._persistence.getPageByFilter(
                    correlationId, filter, new PagingParams(skip, take, false),
                    (err, page) => {
                        pages++;
                        skip += take;
                        // Give small slack for a page
                        reading = pages < 10 && page != null && page.data.length > (take - 3);

                        // Append states to the list. Take the latest for each object
                        if (page != null) {
                            for (let states of page.data) {
                                for (let state of states.states) {
                                    // Todo: Shall we consider assigned objects here?
                                    let pos = _.findIndex(result, (s) => s.object_id == state.object_id);
                                    if (pos < 0)
                                        result.push(state);
                                    else if (result[pos].time.getTime() < state.time.getTime())
                                        result[pos] = state;
                                }
                            }
                        }

                        callback(err);
                    }
                )
            },
            () => reading,
            (err) => {
                callback(err, err == null ? result : null);
            }
        );
    }

    private fixState(state: ObjectStateV1): void {
        if (_.isString(state.pos))
            state.pos = JSON.parse(state.pos);

        state.time = DateTimeConverter.toDateTimeWithDefault(state.time, new Date());
    }

    private calculateStartTime(time: Date): Date {
        let year = time.getUTCFullYear();
        let month = time.getUTCMonth();
        let day = time.getUTCDate();
        let hour = time.getUTCHours();
        let min = time.getUTCMinutes();
        let sec = time.getUTCSeconds();
        let msec = time.getUTCMilliseconds();

        let dayStartUtc = Date.UTC(year, month, day);
        let timeUtc = Date.UTC(year, month, day, hour, min, sec, msec);

        let offset = timeUtc - dayStartUtc;
        offset = offset - (offset % this._interval);
        return new Date(dayStartUtc + offset);
    }

    public addState(correlationId: string, state: ObjectStateV1,
        callback?: (err: any) => void): void {
        this.fixState(state);

        let startTime: Date = this.calculateStartTime(state.time);
        let endTime: Date = new Date(startTime.getTime() + this._interval);

        this._persistence.addOne(correlationId,
            state.org_id, startTime, endTime, state,
            (err, states) => {
                if (callback) callback(err);
            }
        );
    }

    public addStates(correlationId: string, states: ObjectStateV1[],
        callback?: (err: any) => void): void {
        let allStates: ObjectStatesV1[] = [];

        // Package states
        for (let state of states) {
            this.fixState(state);

            let startTime: Date = this.calculateStartTime(state.time);

            let thisStates = _.find(allStates, s => s.org_id == state.org_id
                && s.start_time.getTime() == startTime.getTime());

            if (thisStates == null) {
                let endTime: Date = new Date(startTime.getTime() + this._interval);
                thisStates = <ObjectStatesV1>{
                    org_id: state.org_id,
                    start_time: startTime,
                    end_time: endTime,
                    states: []
                };
                allStates.push(thisStates);
            }

            thisStates.states.push(state);
        }

        this._persistence.addBatch(correlationId, allStates, callback);
    }

    public deleteStates(correlationId: string, filter: FilterParams,
        callback?: (err: any) => void): void {
        this._persistence.deleteByFilter(correlationId, filter, callback);
    }

}
