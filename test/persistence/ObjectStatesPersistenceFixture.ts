let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../../src/data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../../src/data/version1/ObjectStatesV1';

import { IObjectStatesPersistence } from '../../src/persistence/IObjectStatesPersistence';

let now = new Date().getTime();
let interval = 300000;
let time1 = new Date(now);
let time2 = new Date(now + interval);
let time3 = new Date(now + 2 * interval);
let point1 = new Date(now);
let point2 = new Date(now + (interval / 2));
let point3 = new Date(now + interval);

let STATE1: ObjectStateV1 = {
    org_id: '1',
    device_id: '1',
    object_id: '1',
    time: point1,
    online: 0,
    immobile: 0
};
let STATE2: ObjectStateV1 = {
    org_id: '1',
    device_id: '1',
    object_id: '1',
    time: point2,
    online: 1,
    immobile: 1
};
let STATE3: ObjectStateV1 = {
    org_id: '1',
    device_id: '1',
    object_id: '1',
    time: point3,
    online: 2,
    immobile: 0
};
let STATE4: ObjectStateV1 = {
    org_id: '1',
    device_id: '2',
    object_id: '2',
    time: point1,
    online: 0,
    immobile: 0
};

export class ObjectStatesPersistenceFixture {
    private _persistence: IObjectStatesPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateObjectStates(done) {
        async.series([
        // Create one state
            (callback) => {
                this._persistence.addOne(
                    null,
                    '1', time1, time2, STATE1,
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.equal(states.org_id, '1');
                        assert.lengthOf(states.states, 1);

                        callback();
                    }
                );
            },
        // Create another state
            (callback) => {
                this._persistence.addOne(
                    null,
                    '1', time1, time2, STATE2,
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.equal(states.org_id, '1');
                        assert.lengthOf(states.states, 2);

                        callback();
                    }
                );
            },
        // Create yet another state
            (callback) => {
                this._persistence.addOne(
                    null,
                    '1', time2, time3, STATE3,
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.equal(states.org_id, '1');
                        assert.lengthOf(states.states, 1);

                        callback();
                    }
                );
            },
        // Create state for another object
            (callback) => {
                this._persistence.addOne(
                    null,
                    '1', time1, time2, STATE4,
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.equal(states.org_id, '1');
                        assert.lengthOf(states.states, 3);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let states1: ObjectStatesV1;

        async.series([
        // Create items
            (callback) => {
//                this.testCreateObjectStates(callback);
                this._persistence.addBatch(
                    null,
                    [
                        {
                            id: null,
                            org_id: '1',
                            start_time: time1,
                            end_time: time2,
                            states: [STATE1, STATE2, STATE4]
                        },
                        {
                            id: null,
                            org_id: '1',
                            start_time: time2,
                            end_time: time3,
                            states: [STATE3]
                        }
                    ],
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                )
            },
        // Get all states
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        states1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the position
            (callback) => {
                states1.states = [];

                this._persistence.update(
                    null,
                    states1,
                    (err, position) => {
                        assert.isNull(err);

                        assert.isObject(position);
                        assert.equal(position.id, states1.id);
                        assert.lengthOf(position.states, 0);

                        callback();
                    }
                );
            },
        // Delete position
            (callback) => {
                this._persistence.deleteByFilter(
                    null,
                    FilterParams.fromTuples('object_id', '1'),
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete positions
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create states
            (callback) => {
                this.testCreateObjectStates(callback);
            },
        // Get states filtered by organization
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.lengthOf(states.data, 2);

                        callback();
                    }
                );
            },
        // Get states by object_ids
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        object_ids: '2'
                    }),
                    new PagingParams(),
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.lengthOf(states.data, 1);

                        callback();
                    }
                );
            },
        // Get states filtered time
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        from_time: time1,
                        to_time: time2
                    }),
                    new PagingParams(),
                    (err, states) => {
                        assert.isNull(err);

                        assert.isObject(states);
                        assert.lengthOf(states.data, 1);

                        callback();
                    }
                );
            },
        ], done);
    }

}
