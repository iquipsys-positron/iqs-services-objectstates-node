let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../../src/data/version1/ObjectStateV1';
import { ObjectStatesMemoryPersistence } from '../../src/persistence/ObjectStatesMemoryPersistence';
import { ObjectStatesController } from '../../src/logic/ObjectStatesController';
import { ObjectStatesHttpServiceV1 } from '../../src/services/version1/ObjectStatesHttpServiceV1';

let time1 = new Date();

let STATE1: ObjectStateV1 = {
    org_id: '1',
    device_id: '1',
    object_id: '1',
    time: new Date(),
    online: 0,
    immobile: 0
};
let STATE2: ObjectStateV1 = {
    org_id: '1',
    device_id: '2',
    object_id: '2',
    time: new Date(),
    online: 1,
    immobile: 1
};

suite('ObjectStatesController', ()=> {    
    let persistence: ObjectStatesMemoryPersistence;
    let controller: ObjectStatesController;

    setup(() => {
        persistence = new ObjectStatesMemoryPersistence();
        controller = new ObjectStatesController();

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-objectstates', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-objectstates', 'controller', 'default', 'default', '1.0'), controller
        );
        controller.setReferences(references);
    });
        
    test('CRUD Operations', (done) => {
        async.series([
        // Create one state
            (callback) => {
                controller.addState(
                    null, STATE1,
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Create another state
            (callback) => {
                controller.addStates(
                    null, [STATE2],
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Get all states
            (callback) => {
                controller.getStates(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Delete states
            (callback) => {
                controller.deleteStates(
                    null, null,
                    (err) => {
                        assert.isNull(err);
                        callback();
                    }
                );
            },
        // Try to get deleted states
            (callback) => {
                controller.getStates(
                    null, null, null,
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 0);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Get States At Time', (done) => {
        let time = new Date();
        let interval = 300000;
        let ids = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

        async.series([
            // Generate points
            (callback) => {
                async.each(ids, (id, callback) => {
                    let fromTime = time.getTime() - 10 * interval;
                    let states = [];
                    for (let n = 0; n < 20; n++) {
                        let time = new Date(fromTime + (n * interval));
                        let state: ObjectStateV1 = {
                            org_id: '1',
                            device_id: id,
                            object_id: id,
                            time: time,
                            online: 0,
                            immobile: 0
                        };
                        states.push(state);
                    }
                    controller.addStates(null, states, callback);
                }, callback);
            },
            // Get raw states
            (callback) => {
                controller.getStates(
                    null,
                    FilterParams.fromTuples(
                        'from_time', new Date(time.getTime() - 900000),
                        'to_time', time
                    ),
                    null,
                    (err, page) => {
                        assert.isNull(err);

                        // 10 objects by 3 sets
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                )
            },
            // Get states at time
            (callback) => {
                controller.getTimelineStates(
                    null, time, null,
                    (err, states) => {
                        assert.isNull(err);

                        assert.lengthOf(states, 10);
                        let thisIds = _.map(states, s => s.object_id);
                        assert.sameMembers(thisIds, ids);

                        callback();
                    }
                )
            }
        ], done);
    });

});