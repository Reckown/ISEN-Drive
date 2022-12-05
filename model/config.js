const args = process.argv.slice(2);


module.exports = {
    url : process.env.MONGODB_URI,
    dbName : process.env.DB_NAME,
    categoriesCollectionName : "categories",
    productsCollectionName : "products"
}
