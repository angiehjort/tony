const matrix = require('node-sense-hat').Leds
var d3fetch = require("d3-fetch");
var d3timeformat = require("d3-time-format");
var d3scale = require("d3-scale")
var d3time = require("d3-time")


const App = require("./app.js");

class Sun extends App {
    delay(){
      return new Promise((resolve, reject)=>{
        matrix.flashMessage("# # # sun", 0.2, [255, 0, 0], done);
        function done(){
          
          resolve();
        }
      });
    }
    
    setup(){
      this.latestData = null;
      this.data = null;
      setInterval(this.service.bind(this),1000);
    }

    getIcon(){
      return [100,100,0];
    }
  
    service(){
      let date = d3timeformat.utcFormat("%Y-%m-%d")(new Date);
      let timezone = d3timeformat.timeFormat("%Z")(new Date).split("");
      timezone.splice(3,0,":");
      timezone = "+00:00"// timezone.join("");
      
      const _this = this;
      if(!this.latestData || new Date() - this.latestData > 1000*60){
        const url = `https://api.met.no/weatherapi/sunrise/2.0/.json?lat=58.93970&lon=18.30250&date=${date}&offset=${timezone}`;
        d3fetch.json(url)
          .then(function(data) {
            _this.data = data.location.time[0];
            _this.latestData = new Date();
            console.info("got new moon data", _this.data);
          })
          .catch(console.error);
      }
    }
  
    render(){
      if(!this.data) return new Promise((resolve, reject)=>{setTimeout(resolve, 10)});
      const hours = (value) => d3timeformat.timeFormat("%H")(value);
      const parse = (value) => d3timeformat.isoParse(value);
            
      const sunrise = hours(parse(this.data.sunrise.time));
      const sunset = hours(parse(this.data.sunset.time));
      const noon = hours(parse(this.data.solarnoon.time));
      const midnight = hours(parse(this.data.solarmidnight.time));
      const now = hours(new Date);

      const isNight = (value) => value < sunrise || sunset < value;
      const isDay = (value) => sunrise < value || value < sunset;
      const isBedtime = (value) => 6 < value || value < 23;

      matrix.lowLight = isBedtime(now);

      const clockface = `
         O, H9,H10,H11,H12,H13,H14,  O,
        H8,  O,M24,M28,M32,M36,  O,H15,
        H7,M20,  O,  O,  O,  O,M40,H16,
        H6,M16,  O,S15,S30,  O,M44,H17,
        H5,M12,  O, S0,S45,  O,M48,H18,
        H4, M8,  O,  O,  O,  O,M52,H19,
        H3,  O, M4, M0,M60,M56,  O,H20,
         O, H2, H1, H0,H23,H22,H21,  O
      `.split(",").map(d => d.trim());
    
      const randomness = 40;

      const interval = setInterval(()=>{

        matrix.setPixels(clockface.map((d)=>{
          let random = Math.round((Math.random()-0.5)*randomness);
          //if(isNight(now)) return [1, 1, 1]; // sleep

          if(d=="O") return [1, 1, 1];
          if(d=="SUN") return [64,64,0];
          if(d.includes("H")){
            d = parseInt(d.replace("H",""));
            if(d == sunrise) return [255, 100, 0];
            if(d == sunset) return [255, 100, 0];
            if(d == noon) return [255, 100, 0];
            if(d == midnight) return [100, 0, 255];
            if(d == now) return [255, 255, 255];
            if(d < now && isNight(d)) return [0, 0, 150 + random];
            if(d < now && isDay(d)) return [150 + random, 150 + random, 0];
            if(isNight(d)) return [0,0,50];
            if(isDay(d)) return [50,50,0];
            return [1, 1, 1];
          }
          if(d.includes("M")){
            d = parseInt(d.replace("M",""));
            if(d < (new Date).getUTCMinutes()) return [224 + random,224 + random,0];
            return [50, 50, 0];
          }
          if(d.includes("S")){
            d = parseInt(d.replace("S",""));
            if(d < (new Date).getUTCSeconds()) return [224 + random,224 + random,0];
            return [50, 50, 0];
          }
          return [1, 1, 1];
        }));
      }, 50)

      return new Promise((resolve, reject)=>{setTimeout(()=>{
        clearInterval(interval);
        resolve();
      }, 60000)});
    }

}

module.exports = Sun;