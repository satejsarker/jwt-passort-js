const express = require('express');
const { route } = require('./users');
const { ajv } = require("../schema/validation")
const Apartment = require('../model/apartment_model');
const { query } = require('express');
const { alwaysValidSchema } = require('ajv/dist/compile/util');
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
        try {
            if (req.query.hasOwnProperty('long') && req.query.hasOwnProperty('lat')) {
                // locaiton wise filter
                coordinate = [parseFloat(req.query.lat)]
                delete req.query.lat
                coordinate.push(parseFloat(req.query.long))
                delete req.query.long
                all_query = Object.assign({}, req.query)
                console.log(all_query)
                all_query['location'] = {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: coordinate
                        },
                        $maxDistance: 10,
                        $minDistance: 0
                    }
                }
                console.log(all_query["location"]['$near'])

                filter_wise_data = await Apartment.find(all_query)
                return res.json(filter_wise_data)
            }
            filter_wise_data = await Apartment.find(req.query)
            if (filter_wise_data.length == 0) {
                return res.status(404).json({
                    message: "filter item not found"
                })
            }
            return res.json(filter_wise_data)
        } catch (err) {
            console.log(err)
            return res.status(404).json({
                message: "filter item not found"
            })
        }
    })
    // Geo location wise search 
router.get("/filter_by_location", async(req, res, next) => {
    try {

    } catch (error) {
        return res.status(404).json({
            message: "filter item not found"
        })
    }
})

module.exports = router;