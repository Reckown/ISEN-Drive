const config = require("./config.js")
const { MongoClient, ObjectId } = require('mongodb');

const Category = {

    getAll : function(){
        return this._get();
    },

    getById : function(categoryId){
        return this._get({_id: new ObjectId(categoryId)});
    },

    _get : async function(filter) {
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const db = client.db(config.dbName);
            const categoriesCollection = db.collection(config.categoriesCollectionName);
            const productsCollection = db.collection(config.productsCollectionName);
            filter = filter ?? {};
            const categories = await categoriesCollection.find(filter).toArray();

            for (let category of categories) {
                category.size = await productsCollection.count({categoryId: category._id});
            }

            return categories;
        }
        finally {
            await client.close();
        }
    },

    insert : async function(category){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const db = client.db(config.dbName);
            const categoriesCollection = db.collection(config.categoriesCollectionName);
            return await categoriesCollection.insertOne(category);
        }
        finally {
            await client.close();
        }

    },

    // Attention : implémentation incomplète : en l'état, les produits du rayon supprimé sont toujours en base, avec un id de rayon qui ne correspond plus à rien
    // TODO : implémenter l'une des stratégies suivantes pour ne pas que des produits pointent sur un rayon qui n'existe plus
    // 1. Ne pas autoriser la suppression d'un rayon contenant des produits (équivalent d'un ON DELETE RESTRICT en SQL)
    // 2. Supprimer tous les produits du rayon (équivalent d'un ON DELETE CASCADE)
    delete : async function(categoryId){
        const client = new MongoClient(config.url);

        try {
            await client.connect();
            const db = client.db(config.dbName);
            const categoriesCollection = db.collection(config.categoriesCollectionName);
            return await categoriesCollection.deleteOne({_id: new ObjectId(categoryId)});
        }
        finally {
            await client.close();
        }

    }


}

module.exports = Category;
