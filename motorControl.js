// M1 -> reverse: 1, stop: 64, forward: 127
// M2 -> reverse: 128, stop: 192, forward: 255

const calculateValues = (payload) => {
    let result = payload.split(',');

    return result.map(item => parseInt(item));
}

module.exports = {
    calculateValues
}