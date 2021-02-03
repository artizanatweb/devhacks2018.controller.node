const glob = require('glob');
const Config = require('./../config/Config');
const DistanceEvents = require('./../events/DistanceEvents');
const Distance = require('./Distance');
const filesPattern = Config.get('ttySensor');

class DistanceController {
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
                    let board = new Distance(file);
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

                DistanceEvents.emit('board', 'disconnected', file);
                console.log(`[INFO] board disconnected from ${file}`);
            }
        });
    }
}

module.exports = DistanceController;