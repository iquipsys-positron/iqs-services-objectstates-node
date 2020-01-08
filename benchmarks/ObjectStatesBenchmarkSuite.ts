import { BenchmarkSuite } from 'pip-benchmark-node';
import { Parameter } from 'pip-benchmark-node';

import { AddMongoDbStatesBenchmark } from './AddMongoDbStatesBenchmark';

export class ObjectStatesBenchmarkSuite extends BenchmarkSuite {

    public constructor() {
        super("ObjectStates", "Object states benchmark");

        this.addParameter(new Parameter('InitialRecordNumber', 'Number of records at start', '0'));
        this.addParameter(new Parameter('organizationNumber', 'Number of organizations', '1'));
        this.addParameter(new Parameter('ObjectNumber', 'Number of objects', '100'));
        this.addParameter(new Parameter('StartTime', 'Simulation start time', '2016-01-01T00:00:00.000Z'));
        this.addParameter(new Parameter('Interval', 'Simulation interval', '5000'));
        
        this.addParameter(new Parameter('MongoUri', 'MongoDB URI', null));
        this.addParameter(new Parameter('MongoHost', 'MongoDB Hostname', 'localhost'));
        this.addParameter(new Parameter('MongoPort', 'MongoDB Port', '27017'));
        this.addParameter(new Parameter('MongoDb', 'MongoDB Database', 'benchmark'));
        
        this.addBenchmark(new AddMongoDbStatesBenchmark());
    }

}