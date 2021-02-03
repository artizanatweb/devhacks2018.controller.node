const EventEmitter = require('events');

class HardwareEvents extends EventEmitter {}

module.exports = new HardwareEvents();