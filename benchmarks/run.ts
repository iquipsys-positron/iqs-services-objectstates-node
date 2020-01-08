let _ = require('lodash');
let process = require('process');
let async = require('async');

import { BenchmarkRunner } from 'pip-benchmark-node';
import { ConsoleEventPrinter } from 'pip-benchmark-node';
import { MeasurementType } from 'pip-benchmark-node';
import { ExecutionType } from 'pip-benchmark-node';
import { ObjectStatesBenchmarkSuite } from './ObjectStatesBenchmarkSuite';

let runner = new BenchmarkRunner();

ConsoleEventPrinter.attach(runner);

runner.benchmarks.addSuite(new ObjectStatesBenchmarkSuite);

runner.parameters.set({
    'ObjectStates.InitialRecordNumber': 0,
    'ObjectStates.organizationNumber': 1,
    'ObjectStates.ObjectNumber': 100,
    'ObjectStates.MongoUri': process.env['MONGO_URI'],
    'ObjectStates.MongoHost': process.env['MONGO_HOST'] || 'localhost',
    'ObjectStates.MongoPort': process.env['MONGO_PORT'] || 27017,
    'ObjectStates.MongoDb': process.env['MONGO_DB'] || 'benchmark'
});

runner.configuration.measurementType = MeasurementType.Peak;
runner.configuration.executionType = ExecutionType.Sequential;
runner.configuration.duration = 10 * 24 * 3600;

runner.benchmarks.selectByName(['ObjectStates.AddMongoDbStates']);

runner.run((err: any) => {
    if (err) console.error(err);
});

// Log uncaught exceptions
process.on('uncaughtException', (ex) => {
    console.error(ex);
    console.error("Process is terminated");
    process.exit(1);
});

// Gracefully shutdown
process.on('exit', function () {
    runner.stop();
    //console.log("Goodbye!");
});
