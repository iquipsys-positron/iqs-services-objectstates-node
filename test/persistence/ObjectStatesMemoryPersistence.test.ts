import { ConfigParams } from 'pip-services3-commons-node';

import { ObjectStatesMemoryPersistence } from '../../src/persistence/ObjectStatesMemoryPersistence';
import { ObjectStatesPersistenceFixture } from './ObjectStatesPersistenceFixture';

suite('ObjectStatesMemoryPersistence', ()=> {
    let persistence: ObjectStatesMemoryPersistence;
    let fixture: ObjectStatesPersistenceFixture;
    
    setup((done) => {
        persistence = new ObjectStatesMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new ObjectStatesPersistenceFixture(persistence);
        
        persistence.open(null, done);
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