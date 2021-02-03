const DataBase = require('./DataBase');

class Users extends DataBase {
    constructor() {
        super();

        this.tableName = 'users';
    }

    get(id) {
        if (!(id > 0)) {
            return undefined;
        }

        let select = this.db.select().table(this.tableName);
        select.where('id', '=', id).then(function(row) {
            console.log(row);
        });
    }
}

module.exports = new Users();