import { Descriptor } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';
import { ObjectStatesServiceFactory } from '../build/ObjectStatesServiceFactory';

export class ObjectStatesLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("object_states", "Object states function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-objectstates', 'controller', 'default', '*', '*'));
        this._factories.add(new ObjectStatesServiceFactory());
    }
}

export const handler = new ObjectStatesLambdaFunction().getHandler();