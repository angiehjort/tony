const matrix = require('node-sense-hat').Leds
const App = require("./app.js");
const Base = require("./base.js");
const Moon = require("./moon.js");
const Sun = require("./sun.js");
const Advent = require("./advent.js")
const Temperature = require("./temperature.js");
//const JoystickLib = require("node-sense-hat").Joystick;
//const imu = require("node-sense-hat").Imu;

//fetch polyfill
if (typeof fetch !== 'function') {
  global.fetch = require('node-fetch-polyfill');
}

matrix.setRotation(90)
matrix.clear();

const base = new Base();

base
  .register(new Advent())
  //.register(new Moon())
  //.register(new Sun())
  //.register(new Temperature())
  .cycle();
