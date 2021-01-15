const matrix = require('node-sense-hat').Leds
//const JoystickLib = require("node-sense-hat").Joystick;
//const imu = require("node-sense-hat").Imu;
var d3fetch = require("d3-fetch");
var d3timeformat = require("d3-time-format");
const { createCanvas } = require('canvas')


const App = require("./app.js");

class Moon extends App {
  
  setup(){
    this.latestData = null;
    this.data = null;
    setInterval(this.service.bind(this),1000);
  }

  getIcon(){
    return [100,100,100];
  }

  service(){
    let date = d3timeformat.utcFormat("%Y-%m-%d")(new Date);
    let timezone = d3timeformat.timeFormat("%Z")(new Date).split("");
    timezone.splice(3,0,":");
    timezone = timezone.join("");
    
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
    let interval = null;
    
      
      
        // var renderSVG = function(svgEl, renderedCallback, jpgQuality) {
        //   // WARNING! Inline <image> tags must have a base64-encoded image as their source. Linked image files will not work.
        //   // transform svg into base64 image
        //   var s = new XMLSerializer().serializeToString(svgEl);
        //   var uri = 'data:image/svg+xml;base64,' + window.btoa(s);
        
        //   // load svg image into canvas
        //   var image = new Image();
        //   image.onload = function() {
        //     var canvas = document.createElement('canvas');
        //     canvas.width = image.width;
        //     canvas.height = image.height;
        //     var context = canvas.getContext('2d');
        //     context.drawImage(image, 0, 0);
        //     if(jpgQuality > 0.2) {
        //       var jpg = canvas.toDataURL('image/jpeg', jpgQuality);
        //       renderedCallback(jpg);
        //     } else {
        //       var png = canvas.toDataURL('image/png');
        //       renderedCallback(png);
        //     }
        //   }
        //   image.src = uri;
        // };
      
      
      // const width = 8
      // const height = 8
      
      // const canvas = createCanvas(width, height)
      // const context = canvas.getContext('2d')
    
    if(!this.data) return new Promise((resolve, reject)=>{setTimeout(resolve, 10)});

    
    const hours = (value) => d3timeformat.timeFormat("%H")(value);
    const parse = (value) => d3timeformat.isoParse(value);

    const sunrise = hours(parse(this.data.sunrise.time));
    const sunset = hours(parse(this.data.sunset.time));
    const now = hours(new Date);

    const isNight = (value) => value < sunrise || sunset < value;
    const isDay = (value) => sunrise < value || value < sunset;
    const isBedtime = (value) => 6 < value || value < 23;

    matrix.lowLight = isBedtime(now);

    matrix.clear([0,0,0]);

    const X = 1000;
    const newmoon = [
        X, 0, 0, 0, 0, 0, 0, X,
        0, X, X, X, X, X, X, 0,
        0, X, X, X, X, X, X, 0,
        0, X, X, X, X, X, X, 0,
        0, X, X, X, X, X, X, 0,
        0, X, X, X, X, X, X, 0,
        0, X, X, X, X, X, X, 0,
        X, 0, 0, 0, 0, 0, 0, X,
    ];
    
    const waning = [
        X, 1, 1, 1, 2, 4, 6, X,
        1,10,16,22,28,34,40,46,
        1,12,18,24,30,36,42,48,
        1,14,20,26,32,38,44,49,
        1,14,20,26,32,38,44,49,
        1,12,18,24,30,36,42,48,
        1,10,16,22,28,34,40,46,
        X, 1, 1, 1, 2, 4, 6, X,
    ];
    
    function flipHor(array) {return array.map((d,i) => array[7 + i - i%8 - i%8])};
    const waxing = flipHor(waning);
    
    
    function applymask(mask, value){
    
      const randomness = 2;
      const base = 10;
        
      return setInterval(()=>{
        matrix.setPixels(mask.map((d)=>{
          let random = Math.round((Math.random()-0.5)*randomness);
          return d <= value? [base + random, base + random, base + random] : [1, 1, 1]
        }));
      },50)
    }
    

    let value = this.data.moonposition. phase;
      
    
    if (value < 8 || value > 92) {
      interval = applymask(newmoon, 0);
    } else if (value <= 50) {
      interval = applymask(waxing, value);
    } else {
      interval = applymask(waning, 100-value);
    }

    return new Promise((resolve, reject)=>{setTimeout(()=>{
      if(interval) clearInterval(interval);
      resolve();
    }, 60000)});
      
  }

}

module.exports = Moon;