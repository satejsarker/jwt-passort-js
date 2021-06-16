const express = require('express');
const router = express.Router();
const User = require('../model/user_model')
const Apartment = require('../model/apartment_model')
const { ajv } = require("../schema/validation")


router.get("/list",async (req, res, next) => {
        /*
        Get the user information from token serialization and find list of all
         favorite item
         */
    try{
        let user= await User.findById( req.user._id)
        console.log(user.favorites)
        let all_apartments= await Apartment.find({'_id':{$in:user.favorites}})
        if (all_apartments.length===0)
           return res.status(404).json({
            message:"Favorite item empty"
        })
        return res.json(all_apartments)
    }
    catch (err){
        console.log(err)
        return res.status(404).json({
            message:"Favorite item empty"
        })
    }
})


router.post("/add",async (req, res, next) => {
    /*
    Find user and add favorite items to that list

    only uniq item will be stored
    input value will be validate 1st from`req.body`
     */
    let user;
    const favorite_validator=ajv.getSchema("favorite")
    let favorites;
    if (!favorite_validator(req.body)) {
        return res.status(400).json({
            message: "invalid data"
        })
    } else {
        try {
            user = await User.findById(req.user._id)
            favorites = user.favorites
            favorites=favorites.concat(req.body.favorites_items)
            // only unique value will be stored
            user.favorites=[...new Set(favorites)]
            user.save()
            return res.status(201).send()
        } catch (err) {
            return res.status(500).json({
                message: "item not added "
            })
        }
    }

})
module.exports = router;