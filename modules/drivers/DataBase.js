const DbConnection = require('./DbConnection');

class DataBase {
    constructor() {
        this.tableName = undefined;
        this.db = DbConnection.get();
    }

    getCollection(callback) {
        if (!this.tableName) {
            console.log('Undefined table name!');
            return;
        }

        let select = this.db.select().table(this.tableName);
        select.then(function(rows) {
            // console.log(rows);
            if (undefined == callback) {
                return;
            }

            callback(rows);
        });
    }
}

module.exports = DataBase;