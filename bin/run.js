let ObjectStatesProcess = require('../obj/src/container/ObjectStatesProcess').ObjectStatesProcess;

try {
    new ObjectStatesProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
