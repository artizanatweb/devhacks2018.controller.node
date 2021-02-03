const HardwareEvents = require('./../events/HardwareEvents');
const Reader = require('./Reader');

class ReadersController {
    constructor() {
        this.readers = [];
        this.started = false;
    }

    init() {
        this.startListener();
    }

    startListener() {
        if (this.started) {
            return;
        }

        this.started = true;

        HardwareEvents.on("board", (action, file) => {
            switch (action) {
                case "connected":
                    // add to readers array
                    let reader = new Reader(file);
                    reader.init();
                    this.readers.push(reader);
                    break;
                case "disconnected":
                    // remove from readers array by the fileName
                    this.removeReader(file);
                    break;
                default:
                    break;
            }
        });
    }

    removeReader(file) {
        this.readers.forEach((reader, index) => {
            if (file !== reader.file) {
                return;
            }

            this.readers.splice(index, 1);
        });
    }
}

module.exports = ReadersController;