import { Benchmark } from 'pip-benchmark-node';
import { DateTimeConverter } from 'pip-services3-commons-node';

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { ObjectStateV1 } from '../src/data/version1/ObjectStateV1';
import { ObjectStatesV1 } from '../src/data/version1/ObjectStatesV1';
import { ObjectStatesMongoDbPersistence } from '../src/persistence/ObjectStatesMongoDbPersistence';
import { ObjectStatesController } from '../src/logic/ObjectStatesController';

export class AddMongoDbStatesBenchmark extends Benchmark {
    private _initialRecordNumber: number;
    private _organizationNumber: number;
    private _objectNumber: number;
    private _startTime: Date;
    private _interval: number;

    private _orgId: number;
    private _objectId: number;
    private _time: Date;

    private _persistence: ObjectStatesMongoDbPersistence;
    private _controller: ObjectStatesController;

    public constructor() {
        super("AddMongoDbStates", "Measures performance of adding states into MongoDB database");
    }

    public setUp(callback: (err: any) => void): void {
        this._initialRecordNumber = this.context.parameters.InitialRecordNumber.getAsInteger();
        this._organizationNumber = this.context.parameters.organizationNumber.getAsInteger();
        this._objectNumber = this.context.parameters.ObjectNumber.getAsInteger();
        this._startTime = DateTimeConverter.toDateTime(this.context.parameters.StartTime.getAsString());
        this._interval = this.context.parameters.Interval.getAsInteger();

        this._time = this._startTime;
        this._orgId = 1;
        this._objectId = 1;

        let mongoUri = this.context.parameters.MongoUri.getAsString();
        let mongoHost = this.context.parameters.MongoHost.getAsString();
        let mongoPort = this.context.parameters.MongoPort.getAsInteger();
        let mongoDb = this.context.parameters.MongoDb.getAsString();

        this._persistence = new ObjectStatesMongoDbPersistence();
        this._persistence.configure(ConfigParams.fromTuples(
            'connection.uri', mongoUri,
            'connection.host', mongoHost,
            'connection.port', mongoPort,
            'connection.database', mongoDb
        ));

        this._controller = new ObjectStatesController();
        this._controller.configure(ConfigParams.fromTuples(
            'options.interval', 5 // Set interval to 5 mins
        ));

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-objectstates', 'persistence', 'mongodb', 'default', '1.0'), this._persistence,
            new Descriptor('iqs-services-objectstates', 'controller', 'default', 'default', '1.0'), this._controller
        );
        this._controller.setReferences(references);

        this._persistence.open(null, (err) => {
            if (err == null)
                this.context.sendMessage('Connected to mongodb database');
            callback(err);
        });
    }

    public tearDown(callback: (err: any) => void): void {
        this._persistence.close(null, (err) => {
            this.context.sendMessage('Disconnected from mongodb database');
            callback(err);
        });

        this._persistence = null;
        this._controller = null;
    }

    private nextObject() {
        this._objectId++;

        if (this._objectId > this._objectNumber) {
            this._objectId = 1;
            this._orgId++;

            if (this._orgId > this._organizationNumber) {
                this._orgId = 1;
                this._time = new Date(this._time.getTime() + this._interval);

                console.log('Time ' + this._time);
            }
        }
    }

    private getRandomCoord() {
        return Math.random() * 360 - 180;
    }

    private getRandomSpeed() {
        return Math.random() * 100;
    }

    private getRandomAlt() {
        return Math.random() * 100;
    }

    private getRandomAngle() {
        return Math.random() * 360;
    }
    
    // public execute(callback: (err: any) => void): void {
    //     this._controller.addState(
    //         null, this._orgId.toString(), this._objectId.toString(),
    //         this._time, this.getRandomCoord(), this.getRandomCoord(),
    //         this.getRandomAlt(), this.getRandomSpeed(), this.getRandomAngle(), 
    //         (err) => {
    //             this.nextObject();
    //             callback(err);
    //         }
    //     );
    // }

    public execute(callback: (err: any) => void): void {
        let states: ObjectStateV1[] = [];

        for (let orgId = 1; orgId <= this._organizationNumber; orgId++) {
            for (let objectId = 1; objectId <= this._objectNumber; objectId++) {
                states.push({
                    org_id: orgId.toString(),
                    device_id: objectId.toString(),
                    object_id: objectId.toString(),
                    time: this._time,
                    pos: { type: 'Point', coordinates: [ this.getRandomCoord(), this.getRandomCoord() ] },
                    alt: this.getRandomAlt(),
                    speed: this.getRandomSpeed(),
                    angle: this.getRandomAngle(),
                    online: 0,
                    immobile: 0
                });
            }
        }

        this._time = new Date(this._time.getTime() + this._interval);
                
        this._controller.addStates(null, states, callback);
    }

}