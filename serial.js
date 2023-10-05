const { SerialPort } = require('serialport');

const motorDriverSerial = {
    path: '/dev/ttyS0',
    baudRate: 9600
}

const port = new SerialPort(motorDriverSerial);

const portWrite = async (data) => {
    return new Promise((resolve, reject)=> {
        port.write(Buffer.from([data]), function(err) {
        if (err) {
            reject(err.message)
        }
            resolve(true);
        })
    });
}

module.exports = {
    port,
    portWrite
}