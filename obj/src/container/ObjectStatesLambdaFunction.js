"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const ObjectStatesServiceFactory_1 = require("../build/ObjectStatesServiceFactory");
class ObjectStatesLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("object_states", "Object states function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-objectstates', 'controller', 'default', '*', '*'));
        this._factories.add(new ObjectStatesServiceFactory_1.ObjectStatesServiceFactory());
    }
}
exports.ObjectStatesLambdaFunction = ObjectStatesLambdaFunction;
exports.handler = new ObjectStatesLambdaFunction().getHandler();
//# sourceMappingURL=ObjectStatesLambdaFunction.js.map