const mqttEndpoint = `mqtts://${process.env.AWS_ROVY_MQTT_ENDPOINT}:8883`;
const mqttMotorChannel = 'rovy/motor/c7de5c35-3882-48bc-bac6-f67fcf50da0f';
const mqttSensorTopic =
  "rovy/sensor/c7de5c35-3882-48bc-bac6-f67fcf50da0f";

module.exports = {
    mqttMotorChannel,
    mqttEndpoint,
    mqttSensorTopic
}