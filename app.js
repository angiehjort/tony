class App {

    constructor(name=""){
        this.name = name;
        this.views = [];
        this.screentime = 1000;
        this.setup();
    }

    setup(){}

    getIcon(){
        return [0,0,0];
    }

    async render() {
        await this.delay();
    }

    delay() {
        return new Promise(resolve => setTimeout(resolve, this.screentime));
    }
}

module.exports = App;