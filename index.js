const { spawn } = require('child_process');
const kvsClient = spawn('/home/pi/rovy-cam/kvsWebrtcClientMasterGstSample', ['test-stream']);

const { mqttMotorChannel } = require("./constants");
const { mqttClient } = require('./iot');
const { motorSerialPort, motorPortWrite } = require('./motorSerial');
const { gps, gpsSerialParser } = require('./gpsSerial');
const { lteSerialPort, lteSerialParser, ltePortWrite } = require('./lteSerial');
const { bme280, forcedRead } = require('./bme280');

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

    client.subscribe(mqttMotorChannel, (err) => {
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
    console.log(gps.state);
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
      forcedRead(sensor).catch(console.log);
    }, 5000);
}).catch(console.log);

// KVS OUT LISTENERS

kvsClient.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});
  
kvsClient.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

// <batt_voltage>,<batt_percent>,<bme280_temp>,<bme280_humidity>,<bme280_pressure>,<gps_lat>,<gps_lon>

