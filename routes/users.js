var express = require('express');
var router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken');
const { ajv } = require("../schema/validation")
require('dotenv').config()


// signup api route
router.post('/signup',
    async(req, res, next) => {
        const user_validation = ajv.getSchema("user")
        if (user_validation(req.body)) {
            passport.authenticate('register', async(err, user, info) => {
                console.log(err, user, info)
                if (err) {
                    return res.status(409).json({
                        "message": `user already existis with ${req.body.email}`
                    })
                }

                return res.status(201).json(info);
            })(req, res, next);
        } else {
            return res.status(400).json({ "message": "data not valid for user creation" })
        }

    }

);

// Login route 
router.post('/login', async(req, res, next) => {
    passport.authenticate('login', async(err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return res.status(403).json({ info })
            }

            req.login(
                user, { session: false },
                async(error) => {
                    if (error) return next(error);

                    const body = { _id: user._id, email: user.email };
                    const token = jwt.sign({ user: body }, process.env.TOKEN_SECRET);

                    return res.json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;