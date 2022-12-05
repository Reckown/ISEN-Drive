var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render("index", {title:"Bienvenue à ISEN Drive"});
});

module.exports = router;
