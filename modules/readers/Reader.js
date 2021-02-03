const HardwareEvents = require('./../events/HardwareEvents');
const ReaderEvents = require('./../events/ReaderEvents');
const TagEvents = require('./../events/TagEvents');
const Products = require('./../drivers/Products');

class Reader {
    constructor(file) {
        this.file = file;
        this.tag = "0";
        this.started = false;
    }

    init() {
        this.startListner();
    }

    setTag(tag) {
        console.log(`[TAG] New tag: ${tag}`);
        if (tag === this.tag) {
            this.productDescend();
            return;
        }

        this.tag = tag;
    }

    startListner() {
        if (this.started) {
            return;
        }

        this.started = true;

        HardwareEvents.on("board", (action, file) => {
            //
            return;
        });

        ReaderEvents.on("message", (file, jsonData) => {
            if (file !== this.file) {
                return;
            }
            console.log(`[INFO] RFID message received in Reader: ${file}`);
            console.log(jsonData);

            if (this.tag === "0" && jsonData.tag === "0") {
                return;
            }
            console.log(jsonData.tag);
            if (jsonData.tag === "0") {
                this.productRaised();
                return;
            }

            let tag = jsonData.tag;
            tag = tag.replace(/[^0-9.]/g, "");

            this.setTag(tag);
        });
    }

    stopListener() {
        //
    }

    productRaised() {
        TagEvents.emit("tag", "off", this.tag);
    }

    productDescend() {
        TagEvents.emit("tag", "on", this.tag);
    }
}

module.exports = Reader;