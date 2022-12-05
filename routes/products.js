const express = require("express");
const Category = require("../model/Category.js");
const router = express.Router();

router.get('/new', function(req, res) {
    Category.getAll().then(
        categories => res.render("productForm", {title:"Créer un produit", categories:categories})
    );
});

module.exports = router;
