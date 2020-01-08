let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { ObjectStateV1 } from '../../src/data/version1/ObjectStateV1';
import { ObjectStatesMemoryPersistence } from '../../src/persistence/ObjectStatesMemoryPersistence';
import { ObjectStatesController } from '../../src/logic/ObjectStatesController';
import { ObjectStatesLambdaFunction } from '../../src/container/ObjectStatesLambdaFunction';

let time1 = new Date();

let STATE1: ObjectStateV1 = {
    org_id: '1',
    device_id: '1',
    object_id: '1',
    time: time1,
    online: 0,
    immobile: 0
};
let STATE2: ObjectStateV1 = {
    org_id: '1',
    device_id: '2',
    object_id: '2',
    time: time1,
    online: 1,
    immobile: 1
};

suite('ObjectStatesLambdaFunction', ()=> {
    let lambda: ObjectStatesLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-objectstates:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-objectstates:controller:default:default:1.0'
        );

        lambda = new ObjectStatesLambdaFunction();
        lambda.configure(config);
        lambda.open(null, done);
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        async.series([
        // Create one state
            (callback) => {
                lambda.act(
                    {
                        role: 'object_states',
                        cmd: 'add_state',
                        state: STATE1
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create another state
            (callback) => {
                lambda.act(
                    {
                        role: 'object_states',
                        cmd: 'add_state',
                        state: STATE2
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all states
            (callback) => {
                lambda.act(
                    {
                        role: 'object_states',
                        cmd: 'get_states' 
                    },
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
                lambda.act(
                    {
                        role: 'object_states',
                        cmd: 'delete_states'
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get deleted states
            (callback) => {
                lambda.act(
                    {
                        role: 'object_states',
                        cmd: 'get_states'
                    },
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
});