const fs = require('fs');
const electron = require('electron');
isEmptyObject = require('is-empty-object');

class Config
{
    constructor() {
        this.config = {};
        this.pinNumbers = undefined;
        this.theme = undefined;
        this.pins = undefined;

        try {
            let rawConfig = fs.readFileSync(__dirname + '/../../config.json','utf8');
            this.config = JSON.parse(rawConfig);
        } catch (error) {
            console.log("Can't load config.json file!");

            electron.app.quit();
            // process.exit();
        }
    }

    get(property) {
        let result = undefined;

        if (isEmptyObject(this.config)) {
            return result;
        }

        if (!(this.config.hasOwnProperty(property))) {
            return result
        }

        result = this.config[property];
        return result;
    }
}

module.exports = new Config();