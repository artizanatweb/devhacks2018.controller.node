const EventEmitter = require('events');

class UserEvents extends EventEmitter {}

module.exports = new UserEvents();