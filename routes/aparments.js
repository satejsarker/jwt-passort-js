const express = require('express');
const { route } = require('./users');
const { ajv } = require("../schema/validation")
const Apartment = require('../model/apartment_model')
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    return res.json({ title: 'homeLink welcome you ' });
});

// create apartment
router.post("/createAparment", (req, res, next) => {
    const apartment_validation = ajv.getSchema("apartment")
    valid = apartment_validation(req.body)
    if (!valid) {
        return res.status(400).send()
    }
    req.body["user_id"] = req.user._id
    Apartment.create(req.body, (err, data) => {
        if (err) {
            return res.status(500).send()
        }
        return res.status(201).send()
    })
})

module.exports = router;