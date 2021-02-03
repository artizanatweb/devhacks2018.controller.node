const EventEmitter = require('events');

class DistanceEvents extends EventEmitter {}

module.exports = new DistanceEvents();