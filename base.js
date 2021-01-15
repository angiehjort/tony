const matrix = require('node-sense-hat').Leds

class Base {

    constructor(name=""){
        this.name = name;
        this.apps = [];
        this.cycling = false;
    }

    register(app){
        this.apps.push(app);
        return this;
    }

    cycle(){
        let queue = [];
        const _this = this;
        this.cycling = true;
        function next(){
            if(!_this.cycling) return;
            if(queue.length) {
                queue.pop().render().then(next);
            } else {
                queue = _this.apps.concat();
                next();
            }
        }
        next();
        return this;
    }

    stopCycle(){
      this.cycling = false;
      return this;
    }

    showMenu(){
      const array = d3.range(64);
      matrix.setPixels(array.map(d => this.apps[d] ? this.apps[d].getIcon() : [0,0,0]));
    }

    showCursor(){
      
    }

    
}


module.exports = Base;