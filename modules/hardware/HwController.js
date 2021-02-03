const glob = require('glob');
const Config = require('./../config/Config');
const HardwareEvents = require('./../events/HardwareEvents');
const HwBoard = require('./HwBoard');
const filesPattern = Config.get('ttyRfid');

class HwController {
    constructor() {
        this.boards = [];
        this.files = [];

        this.stared = false;

        this.timer = 0;
    }

    readFiles() {
        let self = this;
        // read files that can be arduinos
        glob(filesPattern, {}, function(err, files) {
            if (!(files.length > 0)) {
                self.removeMissing([]);
                return;
            }

            let i=-1;
            files.forEach(function(file) {
                i++;
                // check if file exists
                if (self.files.indexOf(file) > -1) {
                    // this file exists
                    return;
                }

                self.files.push(file);

                try {
                    // create new board for this file
                    let board = new HwBoard(file);
                    board.openPort();
                    // add reader to self.readers
                    self.boards[file] = board;
                    console.log(`[INFO] board connected on ${file}`);
                } catch (exc) {
                    console.log(exc);
                }

                if (i >= (files.length - 1)) {
                    self.removeMissing(files);
                }
            });
        });
    }

    init() {
        this.start();

        this.timer = setInterval(() => {
            this.readFiles();
        }, 1000);
    }

    start() {
        // bind listeners
        if (this.stared) {
            return;
        }

        this.stared = true;

        HardwareEvents.on("message", (message) => {
            if (!(this.files.length > 0)) {
                return;
            }

            let objMsg = message;
            if (!(typeof objMsg == 'object')) {
                objMsg = JSON.parse(objMsg);
            }

            this.files.forEach((file, index) => {
                console.log(`[INFO] HW message send to ${file}, with content: ${message}`);

                let board = this.boards[file];

                if (objMsg.hasOwnProperty('action')) {
                    if (objMsg.action == "stop") {
                        board.sendMessage(message);
                        return;
                    }

                    if (objMsg.unit_id != board.unitId) {
                        return;
                    }
                }

                board.sendMessage(message);
            });
        });
    }

    removeMissing(newFiles) {
        let self = this;
        // obtain files that are no longer in use
        self.files.forEach(function(file) {
            let index = self.files.indexOf(file);
            if (!(newFiles.indexOf(file) > -1)) {
                self.boards[file].closePort();
                // remove Board object
                self.boards[file] = undefined;
                delete self.boards[file];

                // remove file from files
                self.files.splice(index, 1);

                HardwareEvents.emit('board', 'disconnected', file);
                console.log(`[INFO] board disconnected from ${file}`);
            }
        });
    }
}

module.exports = HwController;