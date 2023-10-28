const { SerialPort } = require('serialport');

const motorDriverSerial = {
    path: '/dev/ttyS0',
    baudRate: 9600
}

const motorSerialPort = new SerialPort(motorDriverSerial);

const motorPortWrite = async (data) => {
    return new Promise((resolve, reject)=> {
        serialPort.write(Buffer.from([data]), function(err) {
        if (err) {
            reject(err.message)
        }
            resolve(true);
        })
    });
}

module.exports = {
    motorSerialPort,
    motorPortWrite
}