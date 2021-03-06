const Config = require('./../config/Config');
const SerialPort = require('serialport');
const ReadLine = SerialPort.parsers.Readline;
const HardwareEvents = require('./../events/HardwareEvents');
const ReaderEvents = require('./../events/ReaderEvents');

class HwBoard {
    constructor(ttyFile) {
        this.baudRate = Config.get('baudRate');
        this.ttyFile = ttyFile;
        
        this.port = undefined;
        this.parser = undefined;

        this.received = 0;

        this.unitId = 0;

        this.timer = 0;
    }

    openPort() {
        let self = this;

        this.parser = new ReadLine();
        this.port = new SerialPort(
            self.ttyFile,
            {
                baudRate: self.baudRate
            },
            function(err) {
                if (err) {
                    console.log('[ERROR] Error encountered: ', err);
                    HardwareEvents.emit('board', 'error', err);
                    return;
                }
            }
        );
        this.port.pipe(this.parser);

        this.bindParser();
        this.bindPort();
    }

    bindParser() {
        let self = this;

        // on data
        this.parser.on('data', function(data) {
            if (!(self.received > 0)) {
                self.received += 1;
                setTimeout(function() {
                    HardwareEvents.emit('board', 'ready', self.ttyFile);
                }, 5000);
            }

            console.log(`[INFO] RAW message received: ${data}`);

            let jsonMessage = undefined;
            try {
                jsonMessage = JSON.parse(data);
            } catch (error) {
                console.log('[INFO] not a json message... skip');
                return;
            }

            // Validation
            if (undefined == jsonMessage) {
                console.log('[INFO] message empty... skip');
                return;
            }

            if (!jsonMessage.hasOwnProperty('unit_id')) {
                console.log('[INFO] message has no unit_id... skip');
                return;
            }
            // Validation

            self.unitId = jsonMessage.unit_id;

            HardwareEvents.emit('board', 'reader', jsonMessage);
            ReaderEvents.emit('message', self.ttyFile, jsonMessage);
        });

        // on error
        this.parser.on('error', function(err) {
            console.log('[ERROR] parser error: ', err);
        });

        // on ready -- Nu merge decat cu READY parser
        this.parser.on('ready', function() {
            console.log('[INFO] board is ready!');
            HardwareEvents.emit('board', 'ready', self.ttyFile);
        });
    }

    bindPort() {
        let self = this;

        this.port.on('open', function() {
            console.log(`[INFO] board on ${self.ttyFile}`);
            HardwareEvents.emit('board', 'connected', self.ttyFile);
        });
    }

    closePort() {
        if (this.port.isOpen) {
            this.port.close();
        }

        clearTimeout(this.timer);
        this.parser.destroy();
    }

    sendMessage(message) {
        console.log(`Sending message to board: ${message}`)
        this.port.write(message);
    }

    // activateBoard() {
    //     let self = this;

    //     clearTimeout(this.timer);
    //     this.timer = setTimeout(() => {
    //         // send board message to start
    //         let request = new UnitRequest(self.unitId, "board", "start");
    //         self.sendMessage(request.toJson());
    //     }, 2000);
    // }

    // stopBoard() {
    //     clearTimeout(this.timer);
    //     // send board message to stop
    //     let request = new UnitRequest(this.unitId, "board", "stop");
    //     this.sendMessage(request.toJson());
    // }
}

module.exports = HwBoard;