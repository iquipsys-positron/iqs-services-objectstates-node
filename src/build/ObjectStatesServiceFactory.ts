import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { ObjectStatesMongoDbPersistence } from '../persistence/ObjectStatesMongoDbPersistence';
import { ObjectStatesFilePersistence } from '../persistence/ObjectStatesFilePersistence';
import { ObjectStatesMemoryPersistence } from '../persistence/ObjectStatesMemoryPersistence';
import { ObjectStatesController } from '../logic/ObjectStatesController';
import { ObjectStatesHttpServiceV1 } from '../services/version1/ObjectStatesHttpServiceV1';

export class ObjectStatesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-objectstates", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-objectstates", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-objectstates", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-objectstates", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-objectstates", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-objectstates", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(ObjectStatesServiceFactory.MemoryPersistenceDescriptor, ObjectStatesMemoryPersistence);
		this.registerAsType(ObjectStatesServiceFactory.FilePersistenceDescriptor, ObjectStatesFilePersistence);
		this.registerAsType(ObjectStatesServiceFactory.MongoDbPersistenceDescriptor, ObjectStatesMongoDbPersistence);
		this.registerAsType(ObjectStatesServiceFactory.ControllerDescriptor, ObjectStatesController);
		this.registerAsType(ObjectStatesServiceFactory.HttpServiceDescriptor, ObjectStatesHttpServiceV1);
	}
	
}
