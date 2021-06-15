var express = require('express');
const { route } = require('./users');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    return res.json({ title: 'homeLink welcome you ' });
});

// create apartment
router.post("/createAparment", function(req, res, next) {
    return res.status(201).json({})
})

module.exports = router;