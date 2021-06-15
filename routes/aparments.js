const express = require('express');
const { route } = require('./users');
const { ajv } = require("../schema/validation")
const Apartment = require('../model/apartment_model');
const { query } = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    return res.json({ title: 'homeLink welcome you ' });
});

// create apartment
router.post("/createAparment", async(req, res, next) => {
        const apartment_validation = ajv.getSchema("apartment")
        valid = apartment_validation(req.body)
        if (!valid) {
            return res.status(400).send()
        }
        req.body["user_id"] = req.user._id
        await Apartment.create(req.body, (err, data) => {
            if (err) {
                return res.status(500).send()
            }
            return res.status(201).send()
        })
    })
    // fetch all data
router.get("/allapartment", async(req, res, next) => {
        try {
            all_data = await Apartment.find({})
            if (all_data.length != 0)
                return res.json(all_data)
            return res.status(404).json({ "message": "no data found" })
        } catch (err) {
            return res.status(404).json({ "message": "no data found" })
        }

    })
    // filter data on city rooms and county
router.get("/filter", async(req, res, next) => {
    console.log(req.query)
    try {
        room_wise_data = await Apartment.find(req.query)
        if (room_wise_data.length == 0) {
            return res.status(404).json({
                message: "filter item not found"
            })
        }
        return res.json(room_wise_data)
    } catch (err) {
        return res.status(404).json({
            message: "filter item not found"
        })
    }
})

module.exports = router;