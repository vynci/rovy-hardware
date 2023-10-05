const { mqttMotorChannel } = require("./constants");
const { client } = require('./iot');
const { port, portWrite } = require('./serial');
const motor = require("./motorControl");

port.on('open', async function() {
    console.log('serial port ready');

    const procedures = motor.calculateValues('0,0');

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await portWrite(procedures[step]);
        }
    }
});

port.on('error', function(err) {
    console.log('Error: ', err.message)
});

client.on("connect", () => {
    console.log('connected to mqtt broker');

    client.subscribe(mqttMotorChannel, (err) => {
        if(!err) console.log(`subscribed to [${mqttMotorChannel}]`);
    });
});

client.on("message", async (topic, message) => {
    const procedures = motor.calculateValues(message.toString());

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await portWrite(procedures[step]);
        }
    }
});



