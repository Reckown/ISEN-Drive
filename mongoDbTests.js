const {MongoClient} = require("mongodb");
const client = new MongoClient('mongodb://localhost:27017');

async function getCategories() {

    try{
        await client.connect();
        const db = client.db("isen_drive");
        const categoriesCollection = db.collection("categories");
        const productsCollection = db.collection("products");
        const categories = await categoriesCollection.find().toArray();

        for (let category of categories) {
            category.size = await productsCollection.count({categoryId: category._id});
        }

        return categories;
    }
    finally{
        await client.close();
    }
}

getCategories()
    .then( console.log )
    .catch(console.error)
