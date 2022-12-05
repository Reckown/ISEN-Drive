const express = require("express");
const debug = require('debug')('routers');
const { body } = require('express-validator');
const Category = require("../model/Category.js");
const Product = require("../model/Product.js");
const router = express.Router();

// ---------- Routes GET

// Affichage des rayons
router.get('/', function(req, res) {

    Category.getAll().then( categories =>
        res.render("categories", {title:"Rayons", categories:categories})
    );
});

// Création d'un rayon
router.get('/new', function(req, res) {
    res.render("categoryForm", {title:"Créer un rayon"});
});

// Affichage d'un rayon
router.get('/:id', function(req, res) {

    const categoryId = req.params.id;
    const options = { categoryId: categoryId };

    Category.getById(categoryId)
        .then( categories => {
            options.title=`Produits du rayon ${categories[0].name}`;
            return Product.getByCategory(categoryId);
        })
        .then( products => {
            options.products = products;
            res.render("category", options);
        });
});

// suppression d'un rayon
router.get('/:id/delete', function(req, res) {

    const categoryId = req.params.id;
    const options = { title: "Confirmation de suppression", itemId: categoryId, itemType: "rayon" };

    Category.getById(categoryId)
        .then( categories => {
            options.itemName = categories[0].name;
            res.render("deleteConfirm", options);
        });

});


// ---------- Routes POST

// création d'un rayon
router.post('/new',

    body('name').isLength({ min: 3 }).escape(),

    (req, res, next) => {

        Category.insert( { name : req.body.name })
            .then( insertRes => {
                debug(`Category '${req.body.name}' created (id : ${insertRes.insertedId.toString()})`);
                res.redirect("/categories");
            } );

    }
);

// suppression d'un rayon
router.post('/:id/delete', function(req, res) {

    const categoryId = req.params.id;

    Category.delete(categoryId)
        .then( deleteRes => {
            debug(`Category ${categoryId} successfully deleted`);
            res.redirect("/categories");
        });

});

module.exports = router;
