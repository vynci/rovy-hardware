const { SerialPort } = require('serialport');

const motorDriverSerial = {
    path: '/dev/ttyS0',
    baudRate: 9600
}

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

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

port.on('open', async function() {
    console.log('serial port ready');
});

port.on('error', function(err) {
    console.log('Error: ', err.message)
});

readline.setPrompt('Enter command:');

readline.prompt();

readline.on('line', async (input) => {
    console.log(`Received: ${input}`);

    if(input === 'forward'){
        await portWrite(127);
        await portWrite(255);
    } else if(input === 'backward') {
        await portWrite(1);
        await portWrite(128);
    } else if(input === 'right') {
        await portWrite(0);
        await portWrite(255);
    } else if(input === 'left') {
        await portWrite(127);
        await portWrite(0);
    } else if(input === 'stop') {
        await portWrite(0);
    }
});



