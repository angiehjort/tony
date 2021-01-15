const imu = require("node-sense-hat").Imu;
const matrix = require("sense-hat-led").sync;
const axios = require('axios').default;
const App = require("./app.js");

const IMU = new imu.IMU();

class Temperature extends App {
    delay(){
      return new Promise((resolve, reject)=>{
        function done(){
          resolve();
        }
      });
    }
    
    setup(){
    }

    getIcon(){
    }
  
    render(){
      IMU.getValue((err, data) => {
        if (err !== null) {
          console.error("Could not read sensor data: ", err);
          return;
        }
        data.temperature = data.temperature.toFixed(1);
        data.pressure = data.pressure.toFixed(1);
        data.humidity = data.humidity.toFixed(1);

        console.log("Temp is: ", data.temperature);
        console.log("Pressure is: ", data.pressure);
        console.log("Humidity is: ", data.humidity);
      

        matrix.clear();
        matrix.flashMessage(" " + data.temperature + " ", 0.2, [255, 0, 0]);
        matrix.flashMessage(" " + data.pressure + " ", 0.2, [0, 255, 0]);
        matrix.flashMessage(" " + data.humidity + " ", 0.2, [0, 0, 255]);
        matrix.clear();

        const url = 'https://docs.google.com/forms/d/e/1FAIpQLSdUWYtRSs8hFASZ3hk-IblGiQbbIyLGVK_samI4TeEKCP7XNA/formResponse';
        const options = {
          method: 'POST',
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
          data: 'entry.213543772=' + data.temperature,
          url,
        };
        axios(options);
      });

      return new Promise((resolve, reject)=>{setTimeout(()=>{
        resolve();
      }, 60000)});
    }

}

module.exports = Temperature;