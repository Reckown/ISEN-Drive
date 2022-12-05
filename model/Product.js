const { MongoClient, ObjectId } = require("mongodb");
const config = require("./config.js");
const Product = {

    getAll : function(){
        return this._get();
    },

    getByCategory : function(categoryId){
        return this._get({categoryId: new ObjectId(categoryId)});
    },

    _get : async function(filter) {
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const db = client.db(config.dbName);
            const productsCollection = db.collection(config.productsCollectionName);
            filter = filter ?? {};
            return await productsCollection.find(filter).toArray();
        }
        finally {
            await client.close();
        }
    },

    insert : async function(product){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const db = client.db(config.dbName);
            const productsCollection = db.collection(config.productsCollectionName);
            return await productsCollection.insertOne(product);
        }
        finally {
            await client.close();
        }
    }

}

module.exports = Product;
