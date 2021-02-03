const EventEmitter = require('events');

class TagEvents extends EventEmitter {}

module.exports = new TagEvents();