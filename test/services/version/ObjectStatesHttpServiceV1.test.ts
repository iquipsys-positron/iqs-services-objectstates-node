let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../../../src/data/version1/ObjectStateV1';
import { ObjectStatesMemoryPersistence } from '../../../src/persistence/ObjectStatesMemoryPersistence';
import { ObjectStatesController } from '../../../src/logic/ObjectStatesController';
import { ObjectStatesHttpServiceV1 } from '../../../src/services/version1/ObjectStatesHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('ObjectStatesHttpServiceV1', ()=> {    
    let service: ObjectStatesHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new ObjectStatesMemoryPersistence();
        let controller = new ObjectStatesController();

        service = new ObjectStatesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-objectstates', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-objectstates', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-objectstates', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        async.series([
        // Create one state
            (callback) => {
                rest.post('/v1/object_states/add_state',
                    {
                        state: STATE1
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Create another state
            (callback) => {
                rest.post('/v1/object_states/add_state', 
                    {
                        state: STATE2
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Get all states
            (callback) => {
                rest.post('/v1/object_states/get_states',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 1);

                        callback();
                    }
                );
            },
        // Get all states
            (callback) => {
                rest.post('/v1/object_states/get_timeline_states',
                    {
                        time: time1
                    },
                    (err, req, res, states) => {
                        assert.isNull(err);

                        assert.isArray(states);
                        assert.lengthOf(states, 2);

                        callback();
                    }
                );
            },
        // Delete states
            (callback) => {
                rest.post('/v1/object_states/delete_states',
                    {},
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get deleted states
            (callback) => {
                rest.post('/v1/object_states/get_states',
                    {},
                    (err, req, res, page) => {
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