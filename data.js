const telemetry = {
    battery: {
      voltage: {
        value: null,
        unit: "V",
      }
    },
    bme280: {
      temperature: {
        value: null,
        unit: "°C",
      },
      humidity: {
        value: null,
        unit: "%",
      },
    },
    gps: {
      lat: {
        value: null,
      },
      lon: {
        value: null,
      },
      speed: {
        value: null,
      },
      track: {
        value: null,
        unit: "°",
      },
      alt: {
        value: null,
        unit: "m",
      },
    },
    lte: {
      signal: { value: null },
    },
    range: {
      ir: { value: null, unit: "cm" },
    },
    set updateBattery(val) {
        this.battery.voltage.value = val;
    },
    set updateTemperature(val) {
        this.bme280.temperature.value = val;
    },
    set updateHumidity(val) {
        this.bme280.humidity.value = val;
    },    
    set updateGPS(val) {
        this.gps = val;
    },
    set updateLTE(val) {
        this.lte.signal.value = val;
    },
    set updateRangeSensor(value) {
        this.range.ir.value = value;
    }                      
};

module.exports = {
    telemetry
}