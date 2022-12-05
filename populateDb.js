const { MongoClient, ServerApiVersion} = require('mongodb');
const {dbName} = require("./model/config");

const args = process.argv.slice(2);
const uri = "mongodb+srv://root:root@tp3-drive.ohzrd3o.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function main() {
    await client.connect()

    //console.log(`Connected successfully to MongoDB server: ${url}`);
    console.log(`Inserting data into database: ${dbName}`);

    await insertData(dbName);
    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());


function insertData(dbName){
    const categories = getCategories();
    let promises = [];

    const db = client.db(dbName);
    const categoriesCollection = db.collection('categories');
    const productsCollection = db.collection('products');

    for(const category of categories){
        promises.push(
            categoriesCollection.insertOne({ name : category.name })
                .then(
                    res => {
                        console.log(`Category '${category.name}' created`);
                        category.products.forEach( product => product.categoryId = res.insertedId );
                        return productsCollection.insertMany( category.products )
                    }
                )
                .then(
                    res => console.log(`${res.insertedCount} products inserted in category '${category.name}'`)
                )
        );
    }

    return Promise.all(promises);
}

function getCategories(){
    const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit.";
    return [
        {
            name: "Boucherie",
            products: [
                { name: "Poulet blanc", price : 6.4, description : loremIpsum},
                { name: "Steak haché boeuf x 2", price : 5.55, description : loremIpsum},
                { name: "Poitrine porc 600g", price : 5.60, description : loremIpsum},
                { name: "Côte agneau x 3", price : 5.25, description : loremIpsum}
            ]
        },
        {
            name: "Boulangerie",
            products: [
                { name: "Baguette", price : 0.9, description : loremIpsum},
                { name: "Pain multicéréales", price : 1.5, description : loremIpsum},
                { name: "Pain de mie", price : 1.04, description : loremIpsum}
            ]
        },
        {
            name: "Produits laitiers",
            products: [
                { name: "Lait x 6", price : 5.15, description : loremIpsum },
                { name: "Yahourt x 12", price : 3.76, description : loremIpsum },
                { name: "Petit suisse x 12", price : 1.94, description : loremIpsum },
                { name: "Fromage blanc", price : 1.79, description : loremIpsum },
                { name: "Beurre", price : 2.39, description : loremIpsum },
                { name: "Crème fraîche", price : 0.07, description : loremIpsum },

            ]
        },
        {
            name: "Fruits & Légumes",
            products: [
                { name: "Mandarines 2kg", price : 3.39, description : loremIpsum },
                { name: "Pommes 1kg", price : 3.99, description : loremIpsum },
                { name: "Poires 4 pcs", price : 4.39, description : loremIpsum },
                { name: "Kiwi 6 pcs", price : 3.89, description : loremIpsum },
                { name: "Poireaux 500g", price : 2.89, description : loremIpsum },
                { name: "Chou rouge", price : 2.29, description : loremIpsum },
                { name: "Carottes 1.5kg", price : 2.99, description : loremIpsum },
                { name: "Pommes de terre 2.5kg", price : 5.49, description : loremIpsum },

            ]
        },
        {
            name: "Bébé",
            products: [
                { name: "Lait 1er age", price : 18.85, description : loremIpsum },
                { name: "Petits pots x 2", price : 1.94, description : loremIpsum },
                { name: "Céréales en poudre", price : 2.95, description : loremIpsum },
                { name: "Couches x 70", price : 22.77, description : loremIpsum },
            ]
        },
        {
            name: "Entretien",
            products: [
                { name: "Lessive", price : 11.40, description : loremIpsum },
                { name: "Eponges", price : 1.80, description : loremIpsum },
                { name: "Liquide vaisselle", price : 1.33, description : loremIpsum },

            ]
        },
    ];
}
