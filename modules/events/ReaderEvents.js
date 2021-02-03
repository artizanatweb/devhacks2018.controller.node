const EventEmitter = require('events');

class ReaderEvents extends EventEmitter {}

module.exports = new ReaderEvents();