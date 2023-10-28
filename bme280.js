const bme280 = require('bme280');

const delay = millis => new Promise(resolve => setTimeout(resolve, millis));

const forcedRead = async sensor => {
  await sensor.triggerForcedMeasurement();
  await delay(sensor.maximumMeasurementTime());
  console.log(await sensor.read());
}

module.exports = {
    bme280,
    forcedRead
}