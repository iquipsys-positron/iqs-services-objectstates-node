"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const ObjectStatesMongoDbPersistence_1 = require("../persistence/ObjectStatesMongoDbPersistence");
const ObjectStatesFilePersistence_1 = require("../persistence/ObjectStatesFilePersistence");
const ObjectStatesMemoryPersistence_1 = require("../persistence/ObjectStatesMemoryPersistence");
const ObjectStatesController_1 = require("../logic/ObjectStatesController");
const ObjectStatesHttpServiceV1_1 = require("../services/version1/ObjectStatesHttpServiceV1");
class ObjectStatesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(ObjectStatesServiceFactory.MemoryPersistenceDescriptor, ObjectStatesMemoryPersistence_1.ObjectStatesMemoryPersistence);
        this.registerAsType(ObjectStatesServiceFactory.FilePersistenceDescriptor, ObjectStatesFilePersistence_1.ObjectStatesFilePersistence);
        this.registerAsType(ObjectStatesServiceFactory.MongoDbPersistenceDescriptor, ObjectStatesMongoDbPersistence_1.ObjectStatesMongoDbPersistence);
        this.registerAsType(ObjectStatesServiceFactory.ControllerDescriptor, ObjectStatesController_1.ObjectStatesController);
        this.registerAsType(ObjectStatesServiceFactory.HttpServiceDescriptor, ObjectStatesHttpServiceV1_1.ObjectStatesHttpServiceV1);
    }
}
exports.ObjectStatesServiceFactory = ObjectStatesServiceFactory;
ObjectStatesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "factory", "default", "default", "1.0");
ObjectStatesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "persistence", "memory", "*", "1.0");
ObjectStatesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "persistence", "file", "*", "1.0");
ObjectStatesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "persistence", "mongodb", "*", "1.0");
ObjectStatesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "controller", "default", "*", "1.0");
ObjectStatesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-objectstates", "service", "http", "*", "1.0");
//# sourceMappingURL=ObjectStatesServiceFactory.js.map