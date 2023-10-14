const mqtt = require('mqtt');
const fs = require('fs');

const { mqttEndpoint } = require('./constants');

const mqttClient = mqtt.connect(
    mqttEndpoint,
    {
        key:  fs.readFileSync('./creds/private.key'),
        cert: fs.readFileSync('./creds/cert.crt'),
        ca: [ fs.readFileSync('./creds/ca.pem') ],
        protocolId: 'MQTT',
        protocolVersion: 5,
    }
);

module.exports = {
    mqttClient
};