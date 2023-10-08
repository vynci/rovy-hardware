// M1 -> reverse: 1, stop: 64, forward: 127
// M2 -> reverse: 128, stop: 192, forward: 255

const m1ForwardMin = 64;
const m2ForwardMin = 192;

const m1ForwardMax = 127;
const m2ForwardMax = 255;

const calculateValues = (payload) => {
    let result = [0,0];
    const x = parseFloat(payload.split(',')[0]);
    const y = parseFloat(payload.split(',')[1]);

    result[0] = Math.floor(((m1ForwardMax - m1ForwardMin) * y) + m1ForwardMin);
    result[1] = Math.floor(((m2ForwardMax - m2ForwardMin) * y) + m2ForwardMin);

    if(x < 0) result[0] = result[0] - ((m1ForwardMax - m1ForwardMin) * x);
    else if(x > 0) result[1] = result[1] + ((m2ForwardMax - m2ForwardMin) * x);

    // clean values maxed up
    if(result[1] > 255) result[1] = 255;

    // handle stop override values
    if(x === 0 && y === 0) {
        result[0] = 0;
        result[1] = 0
    }

    return [Math.floor(result[0]),Math.floor(result[1])];
}

module.exports = {
    calculateValues
}