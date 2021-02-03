const request = require('request');
const Config = require('./../config/Config');
const ProductEvents = require('./../events/ProductEvents');
const UserEvents = require('./../events/UserEvents');

class ServerClient {
    constructor() {
        this.serverIp = Config.get("ipServer");
        this.serverPort = Config.get("portServer");

        this.initialized = false;

        this.baseUrl = `http://${this.serverIp}:${this.serverPort}`;
        this.addUrlPath = `${this.baseUrl }/recognize_and_add_to_basket`;
        this.removeUrlPath = `${this.baseUrl }/recognize_and_remove_from_basket`;
    }

    init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        ProductEvents.on("product", (action, tag) => {
            console.log(`[SERVER EVENT] TAG: ${action} ${tag}`);
            if ("raised" === action) {
                // call server add to cart
                this.addToCart(tag);
                return;
            }

            if ("descend" === action) {
                // call server to remove from cart
                this.removeFromCart(tag);
                return;
            }
        });
    }

    addToCart(tag) {
        let url = `${this.addUrlPath}?product_id=${tag}`;
        this.send(url);

    }

    removeFromCart(tag) {
        let url = `${this.removeUrlPath}?product_id=${tag}`;
        this.send(url);
    }

    send(url) {
        console.log("-------------[SERVER URL]-------------");
        console.log(url);
        request(url, (error,response,body) => {
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.

            if (!(null === error)) {
                return;
            }

            if (!(200 === response.statusCode)) {
                return;
            }
            
            UserEvents.emit("recognized", body);
        });
    }
}

module.exports = new ServerClient();