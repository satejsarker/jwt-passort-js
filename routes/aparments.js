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
    /*
    Apartment will be create with valid schema data  and linked to user
    Schema definition is added fin validation module
     */
    const apartment_validation = ajv.getSchema("apartment")
        if (!apartment_validation(req.body)) {
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
router.get("/allapartments", async(req, res, next) => {
       /*
       Get all the apartment with out any filter
        */
        try {
           let all_data = await Apartment.find({})
            if (all_data.length !== 0)
                return res.json(all_data)
            return res.status(404).json({ "message": "no data found" })
        } catch (err) {
            return res.status(404).json({ "message": "no data found" })
        }

    })
    // filter data on city rooms and county
router.get("/filter", async(req, res, next) => {
    /*
    Apartments can be filter base on city, country, rooms, and location coordinates
    for location query `lat` and `long` must be provided via request query
    and every other query will be accepted via req.query
     */
        try {
            if (req.query.hasOwnProperty('long') && req.query.hasOwnProperty('lat')) {
                // locaiton wise filter
                let coordinate = [parseFloat(req.query.lat)]
                delete req.query.lat
                coordinate.push(parseFloat(req.query.long))
                delete req.query.long
                let all_query = Object.assign({}, req.query)
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
                let filter_wise_data = await Apartment.find(all_query)
                return res.json(filter_wise_data)
            }
            let filter_wise_data = await Apartment.find(req.query)
            if (filter_wise_data.length === 0) {
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

router.get('/createdapartments',async (req,res,next)=>{
    /*
    List all the apartment created by user
     */
    console.log({user_id:req.user._id})
    try{
        let user_apartments= await Apartment.find({"user_id": req.user._id})
        return  res.json(user_apartments)
    }
    catch (err){
        console.log(err)
        return res.status(404).json({
            message:"no apartment is added by user"
        })
    }
})
module.exports = router;