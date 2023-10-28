const { spawn } = require('child_process');
const kvsClient = spawn('/home/pi/rovy-cam/kvsWebrtcClientMasterGstSample', ['test-stream']);

const { mqttMotorChannel } = require("./constants");
const { mqttClient } = require('./iot');
const { motorSerialPort, motorPortWrite } = require('./motorSerial');
const { gps, gpsSerialParser } = require('./gpsSerial');
const { lteSerialPort, lteSerialParser, ltePortWrite } = require('./lteSerial');
const { bme280, forcedRead } = require('./bme280');
const { analogSensors, ADS1115 } = require('./analogSensors');
const { telemetry } = require('./data');

const motor = require("./motorControl");

// MOTOR SERIAL LISTENERS

motorSerialPort.on('open', async function() {
    console.log('Motor Serial Port: Ready');

    const procedures = motor.calculateValues('0,0');

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await motorPortWrite(procedures[step]);
        }
    }
});

motorSerialPort.on('error', function(err) {
    console.log('Error: ', err.message)
});

// MQTT LISTENERS

mqttClient.on("connect", () => {
    console.log('connected to mqtt broker');

    mqttClient.subscribe(mqttMotorChannel, (err) => {
        if(!err) console.log(`subscribed to [${mqttMotorChannel}]`);
    });
});

mqttClient.on("message", async (topic, message) => {
    const procedures = motor.calculateValues(message.toString());

    if(procedures?.length) {
        for (let step = 0; step < procedures.length; step++) {
            await motorPortWrite(procedures[step]);
        }
    }
});

// GPS SERIAL LISTENERS

gps.on('data', data => {
    if(gps.state.lat && gps.state.lon) console.log(gps.state);
    // MQTT SEND HERE
})
  
gpsSerialParser.on('data', (data)=>{
    if(data.includes('$GPVTG') || data.includes('$GPGGA') || data.includes('$GPHDT') || data.includes('$GPRMC')) gps.update(data);
});

// LTE SERIAL LISTENER

lteSerialPort.on('open', async()=>{
    console.log('LTE Serial Port: Ready');
  
    await ltePortWrite('AT+CSQ\r\n');
});

lteSerialParser.on('data', (data)=>{
    data = data.toString();

    if(data.includes('+CSQ:')) {
        data = data.replace('+CSQ: ', '');
        // MQTT SEND HERE
    }
});

// BME280 LISTENER

bme280.open({forcedMode: true}).then(sensor => {
    setInterval(_ => {
      forcedRead(sensor).then((data)=>{
        telemetry.updateTemperature = Math.round(data.temperature);
        telemetry.updateHumidity = Math.round(data.humidity);
      });
    }, 15000);
}).catch(console.log);

// ANALOG SENSORS

analogSensors.openPromisified(1).then(async (bus) => {
    const ads1115 = await ADS1115(bus);
    const full = 26480;
  
    setInterval(async () => {
      let value1 = await ads1115.measure('0+GND');
      let value2 = await ads1115.measure('2+GND');

      const batteryVoltage = (5*(value2/full)) / 0.2
      const irRange = 5*(value1/full);

      telemetry.updateBattery = batteryVoltage.toFixed(2);
      telemetry.updateRangeSensor = irRange.toFixed(4);
    }, 2000);
});

// INTERVAL READER
setInterval(()=>{
    console.log('telemetry', telemetry);
}, 5000)

// KVS OUT LISTENERS

kvsClient.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
  
kvsClient.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

