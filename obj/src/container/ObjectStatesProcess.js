"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const ObjectStatesServiceFactory_1 = require("../build/ObjectStatesServiceFactory");
class ObjectStatesProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("object_states", "Object states microservice");
        this._factories.add(new ObjectStatesServiceFactory_1.ObjectStatesServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.ObjectStatesProcess = ObjectStatesProcess;
//# sourceMappingURL=ObjectStatesProcess.js.map