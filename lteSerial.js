const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const lteSerial = {
    path: '/dev/ttyUSB2',
    baudRate: 115200
}

const lteSerialPort = new SerialPort(lteSerial);

const lteSerialParser = lteSerialPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const ltePortWrite = async (data) => {
    return new Promise((resolve, reject)=> {
        lteSerialPort.write(data, function(err) {
        if (err) {
            reject(err.message)
        }
            resolve(true);
        })
    });
}

module.exports = {
    lteSerialPort,
    lteSerialParser,
    ltePortWrite
}
