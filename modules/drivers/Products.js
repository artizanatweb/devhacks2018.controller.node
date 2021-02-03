const DataBase = require('./DataBase');
const Product = require('./Product');

class Products extends DataBase
{
    constructor() {
        super();

        this.tableName = 'products';

        this.dbProducts = undefined;

        this.products = [];
    }

    getCollection() {
        let self = this;
        super.getCollection(function(rows) {
            self.setProducts(rows);
        });
    }

    setProducts(rows) {
        this.dbProducts = rows;

        this.dbProducts.forEach((productRow, index) => {
            let product = new Product(productRow);
            if (this.products.indexOf(product) > -1) {
                console.log("MATA MARE mARE MARE AMNHGOKF");
                return;
            }
            this.products.push(product);
        });
    }

    getByTag(tag) {
        if (undefined !== tag) {
            let product = this.products.find(p => p.tag == tag);
            return product.id;
        }

        return undefined;
    }
}

module.exports = new Products();