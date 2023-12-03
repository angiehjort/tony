const matrix = require('node-sense-hat').Leds
var d3fetch = require("d3-fetch");
var d3timeformat = require("d3-time-format");
var d3scale = require("d3-scale")
var d3time = require("d3-time")


const App = require("./app.js");

class Advent extends App {
    delay(){
      return new Promise((resolve, reject)=>{
        matrix.flashMessage("# # # sun", 0.2, [255, 0, 0], done);
        function done(){
          
          resolve();
        }
      });
    }
    
    setup(){
    }

    getIcon(){
      return [100,100,0];
    }
  

  
    render(){
      const advents = [
          '2023-12-03 16:30',
          '2023-12-10 16:30',
          '2023-12-17 16:30',
          '2023-12-24 16:30'
      ].map(m => d3timeformat.timeParse("%Y-%m-%d %H:%M")(m));

      const candleLifespan = 28*24*60*60*1000; //28 days

      const now = new Date();

      const candlesProgress = advents.map(m => {
        if(now < m) return 1; // candle isn't lit yet
        return 1 - (now - m) / candleLifespan;
      });

      const pattern = `
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3,
         O, C0, O, C1, O, C2, O, C3
      `.split(",").map(d => d.trim());
    
      const randomness = 100;

      const interval = setInterval(()=>{

        matrix.setPixels(pattern.map((d, i)=>{
          let random = Math.round((Math.random()-0.5)*randomness);
          const row = Math.floor(i/8);

          function drawCandle(candle){
            if(candlesProgress[candle] == 1) return [150,0,0];

            const scaledCandleProgress = Math.floor(8-8*candlesProgress[candle]);
            
            if(row == scaledCandleProgress) return [150 + random,150 + random,0];
            if(row > scaledCandleProgress) return [150,0,0];
            if(row < scaledCandleProgress) return [1, 1, 1];
          }
          
          if(d=="C0") return drawCandle(0);
          if(d=="C1") return drawCandle(1);
          if(d=="C2") return drawCandle(2);
          if(d=="C3") return drawCandle(3);
            
          return [1, 1, 1];
        }));
      }, 50)

      return new Promise((resolve, reject)=>{setTimeout(()=>{
        clearInterval(interval);
        resolve();
      }, 10000)});
    }

}

module.exports = Advent;
