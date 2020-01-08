let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
import { IObjectStatesPersistence } from './IObjectStatesPersistence';

export class ObjectStatesMemoryPersistence 
    extends IdentifiableMemoryPersistence<ObjectStatesV1, string> 
    implements IObjectStatesPersistence {

    constructor() {
        super();
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private matchObject(state: ObjectStateV1, objectId: string): boolean {
        return state.object_id == objectId || state.assign_id == objectId;
    }

    private matchObjects(state: ObjectStateV1, objectIds: string[]): boolean {
        return _.indexOf(objectIds, state.object_id) >= 0
            || _.indexOf(objectIds, state.assign_id) >= 0
    }

    private containsObject(states: ObjectStateV1[], objectId: string): boolean {
        return _.some(states, s => this.matchObject(s, objectId));
    }

    private containsObjects(states: ObjectStateV1[], objectIds: string[]): boolean {
        return _.some(states, s => this.matchObjects(s, objectIds));
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
        let objectId = filter.getAsNullableString('object_id');
        let orgId = filter.getAsNullableString('org_id');
        let objectIds = filter.getAsObject('object_ids');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        
        // Process ids filter
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (!_.isArray(objectIds))
            objectIds = null;
        
        return (item) => {
            if (orgId && item.org_id != orgId) 
                return false;
            if (fromTime && item.end_time.getTime() < fromTime.getTime()) 
                return false;
            if (toTime && item.start_time.getTime() >= toTime.getTime()) 
                return false;
            if (objectId && !this.containsObject(item.states, objectId)) 
                return false;
            if (objectIds && !this.containsObjects(item.states, objectIds))
                return false;
            return true; 
        };
    }

    private filterResults(filter: FilterParams,
        callback: (err: any, page: DataPage<ObjectStatesV1>) => void): any {

        filter = filter || new FilterParams();
        
        let objectId = filter.getAsNullableString('object_id');
        let objectIds = filter.getAsObject('object_ids');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        
        return (err: any, page: DataPage<ObjectStatesV1>) => {
            // Skip when error occured
            if (err != null || page == null) {
                callback(err, page);
                return;
            }

            // Filter out all elements without object id
            for (let item of page.data) {
                if (objectId != null)
                    item.states = _.filter(item.states, s => this.matchObject(s, objectId));
                if (objectIds != null)
                    item.states = _.filter(item.states, s => this.matchObjects(s, objectIds));
                if (fromTime != null)
                    item.states = _.filter(item.states, s => s.time >= fromTime);
                if (toTime != null)
                    item.states = _.filter(item.states, s => s.time < toTime);
            }

            callback(err, page);
        };
    }
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ObjectStatesV1>) => void): void {
            super.getPageByFilter(correlationId, this.composeFilter(filter),
                paging, null, null, this.filterResults(filter, callback));
    }

    public addOne(correlationId: string, orgId: string, startTime: Date, endTime: Date, state: ObjectStateV1,
        callback: (err: any, item: ObjectStatesV1) => void): void {

            let item = this._items.find((x) => { 
                return x.org_id == orgId 
                    && x.start_time <= state.time
                    && x.end_time > state.time; 
            });
    
            if (item == null) {
                item = <ObjectStatesV1> {
                    id: IdGenerator.nextLong(),
                    org_id: orgId,
                    start_time: startTime,
                    end_time: endTime,
                    states: []
                };
                this._items.push(item);
            }
    
            item.states = item.states || [];
            item.states.push(state);
   
            this._logger.trace(correlationId, "Added state for " +  state.object_id + " at " + state.time);
    
            this.save(correlationId, (err) => {
                if (callback) callback(err, item)
            });
        }

    public addBatch(correlationId: string, allStates: ObjectStatesV1[],
        callback: (err: any) => void): void {
        let count = 0;

        for (let states of allStates) {

            let item = this._items.find((x) => { 
                return x.org_id == states.org_id 
                    && x.start_time.getTime() == states.start_time.getTime()
                    && x.end_time.getTime() == states.end_time.getTime(); 
            });

            if (item == null) {
                item = <ObjectStatesV1> {
                    id: IdGenerator.nextLong(),
                    org_id: states.org_id,
                    start_time: states.start_time,
                    end_time: states.end_time,
                    states: []
                };
                this._items.push(item);
            }

            item.states = item.states || [];
            for (let state of states.states) {
                item.states.push(state);
                count++;
            }
        }

        this._logger.trace(correlationId, "Added " + count + " states");

        this.save(correlationId, (err) => {
            if (callback) callback(err)
        });
    }
            
    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}
