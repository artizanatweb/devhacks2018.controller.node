const EventEmitter = require('events');

class ProductEvents extends EventEmitter {}

module.exports = new ProductEvents();