const Config = require('./../config/Config');
const Knex = require('knex');

class DbConnection {
    constructor() {
        this.initialized = false;
        this.knex = undefined;
    }

    init() {
        if ( this.initialized ) {
            return;
        }

        let dbConfig = Config.get('database');
        if (undefined == dbConfig) {
            throw new Error('DataBase configuration missing from config!');
        }

        this.knex = Knex(dbConfig);

        this.initialized = true;
    }

    get() {
        if ( !this.initialized ) {
            this.init();
        }

        return this.knex;
    }
}

module.exports = new DbConnection();