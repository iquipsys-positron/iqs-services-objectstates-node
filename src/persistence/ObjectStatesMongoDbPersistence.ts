let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdGenerator } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { ObjectStateV1 } from '../data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../data/version1/ObjectStatesV1';
import { IObjectStatesPersistence } from './IObjectStatesPersistence';

export class ObjectStatesMongoDbPersistence
    extends IdentifiableMongoDbPersistence<ObjectStatesV1, string>
    implements IObjectStatesPersistence {

    constructor() {
        super('object_states');
        super.ensureIndex({ org_id: 1, start_time: -1, end_time: -1 });
    }

    private matchObject(state: ObjectStateV1, objectId: string): boolean {
        return state.object_id == objectId || state.assign_id == objectId;
    }

    private matchObjects(state: ObjectStateV1, objectIds: string[]): boolean {
        return _.indexOf(objectIds, state.object_id) >= 0
            || _.indexOf(objectIds, state.assign_id) >= 0
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

        let criteria = [];

        let orgId = filter.getAsNullableString('org_id');
        if (orgId != null)
            criteria.push({ org_id: orgId });

        let objectId = filter.getAsNullableString('object_id');
        if (objectId != null) {
            criteria.push({ 
                $or: [
                    { "states.object_id": objectId },
                    { "states.assign_id": objectId }
                ]
            });
        }

        // Filter object ids
        let objectIds = filter.getAsObject('object_ids');
        if (_.isString(objectIds))
            objectIds = objectIds.split(',');
        if (_.isArray(objectIds)) {
            criteria.push({ 
                $or: [
                    { "states.object_id": { $in: objectIds } },
                    { "states.assign_id": { $in: objectIds } }
                ]
            });
        }

        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ end_time: { $gte: fromTime } });

        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ start_time: { $lt: toTime } });

        return criteria.length > 0 ? { $and: criteria } : null;
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
            paging, "-start_time", null, this.filterResults(filter, callback));
    }

    public addOne(correlationId: string, orgId: string, 
        startTime: Date, endTime: Date, state: ObjectStateV1,
        callback: (err: any, item: ObjectStatesV1) => void): void {

        let filter = {
            org_id: orgId,
            start_time: { $lte: state.time },
            end_time: { $gt: state.time }
        };

        let newItem = {
            $push: { states: state },
            $setOnInsert: {
                _id: IdGenerator.nextLong(),
                org_id: orgId,
                start_time: startTime,
                end_time: endTime
            }
        };

        let options = {
            returnOriginal: false,
            upsert: true
        };
        
        this._collection.findOneAndUpdate(filter, newItem, options, (err, result) => {
            if (!err)
                this._logger.trace(correlationId, "Added state for " +  state.object_id + " at " + state.time);
           
            if (callback) {
                let newItem = result ? this.convertToPublic(result.value) : null;
                callback(err, newItem);
            }
        });
    }

    public addBatch(correlationId: string, allStates: ObjectStatesV1[],
        callback: (err: any) => void): void {
        if (allStates == null || allStates.length == 0) {
            if (callback) callback(null);
            return;
        }

        let options = {
            upsert: true
        };

        let batch = this._collection.initializeUnorderedBulkOp();
        let count = 0;

        let operations: any[] = [];

        for (let states of allStates) {
            if (states.states && states.states.length > 0) {
                batch
                    .find({
                        org_id: states.org_id,
                        start_time: states.start_time,
                        end_time: states.end_time
                    })
                    .upsert()
                    .updateOne({
                        $push: { states: { $each: states.states } },
                        $setOnInsert: {
                            _id: IdGenerator.nextLong(),
                            org_id: states.org_id,
                            start_time: states.start_time,
                            end_time: states.end_time
                        }
                    });
                count += states.states.length;
            }
        }

        batch.execute((err) => {
            if (!err)
                this._logger.trace(correlationId, "Added " + count + " states");
            
            if (callback) callback(err);
        });
    }
    
    public deleteByFilter(correlationId: string, filter: FilterParams,
        callback: (err: any) => void): void {
        super.deleteByFilter(correlationId, this.composeFilter(filter), callback);
    }

}
