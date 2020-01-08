import { ConfigParams } from 'pip-services3-commons-node';

import { ObjectStatesFilePersistence } from '../../src/persistence/ObjectStatesFilePersistence';
import { ObjectStatesPersistenceFixture } from './ObjectStatesPersistenceFixture';

suite('ObjectStatesFilePersistence', ()=> {
    let persistence: ObjectStatesFilePersistence;
    let fixture: ObjectStatesPersistenceFixture;
    
    setup((done) => {
        persistence = new ObjectStatesFilePersistence('./data/object_states.test.json');

        fixture = new ObjectStatesPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});