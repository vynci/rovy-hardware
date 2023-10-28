const GPS = require('gps');

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: '/dev/ttyACM0', baudRate: 9600 });

const gpsSerialParser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const gps = new GPS;

module.exports = {
    gps,
    gpsSerialParser
}

