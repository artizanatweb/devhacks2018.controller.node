const ProductEvents = require('./../events/ProductEvents');
const TagEvents = require('./../events/TagEvents');

class Product {
    constructor(row) {
        this.id = null;
        this.name = null;
        this.price = null;
        this.tag = null;
        this.red = null;
        this.green = null;
        this.blue = null;

        this.lastRequestType = "remove";

        this.setup(row);
    }

    setup(row) {
        Object.keys(row).forEach((attr, index) => {
            if (!this.hasOwnProperty(attr)) {
                return;
            }

            this[attr] = row[attr];
        });

        this.bindListener();
    }

    bindListener() {
        TagEvents.on("tag", (action, tag) => {
            if (!(tag === this.tag)) {
                return;
            }
            console.log(`[PRODUCT] I am product!!!`);
            console.log(this.tag);
            console.log(this.name);
            console.log(this.id);

            if ("on" === action) {
                this.descend();
                return;
            }

            if ("off" === action) {
                this.raised();
                return;
            }
        });
    }

    raised() {
        if ("add" === this.lastRequestType) {
            return;
        }

        this.lastRequestType = "add";

        console.log(`[INFO] Product: ${this.id} raised!`);
        ProductEvents.emit("product", "raised", this.id);
    }

    descend() {
        if ("remove" === this.lastRequestType) {
            return;
        }

        this.lastRequestType = "remove";

        console.log(`[INFO] Product: ${this.id} descend!`);
        ProductEvents.emit("product", "descend", this.id);
    }
}

module.exports = Product;