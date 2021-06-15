var express = require('express');
var router = express.Router();
const passport = require('passport')
const jwt = require('jsonwebtoken');
require('dotenv').config()


// signup api route
router.post('/signup',
    passport.authenticate('signup', { session: false }),
    async(req, res, next) => {
        if (req.user.msg) {
            return res.status(409).json({
                message: req.user.msg
            })
        }
        return res.status(201).json({
            message: 'Signup successful',
            user: req.user
        });
    }
);

// Login route 
router.post('/login', async(req, res, next) => {
    passport.authenticate(
        'login',
        async(err, user, info) => {
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
        }
    )(req, res, next);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;