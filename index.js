const { spawn } = require('child_process');
const kvsClient = spawn('/home/pi/rovy-cam/kvsWebrtcClientMasterGstSample', ['test-stream']);

const { mqttMotorChannel } = require("./constants");
const { mqttClient } = require('./iot');
const { serialPort, portWrite } = require('./serial');
const motor = require("./motorControl");

serialPort.on('open', async function() {
    console.log('serial port ready');

    const procedures = motor.calculateValues('0,0');

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await portWrite(procedures[step]);
        }
    }
});

serialPort.on('error', function(err) {
    console.log('Error: ', err.message)
});

mqttClient.on("connect", () => {
    console.log('connected to mqtt broker');

    client.subscribe(mqttMotorChannel, (err) => {
        if(!err) console.log(`subscribed to [${mqttMotorChannel}]`);
    });
});

mqttClient.on("message", async (topic, message) => {
    const procedures = motor.calculateValues(message.toString());

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await portWrite(procedures[step]);
        }
    }
});

kvsClient.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
  
kvsClient.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});



