const User = require('../model/user_model')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
require('dotenv').config()

/*
 *sign up module 
 * singup if no user is present with same email address
 */
passport.use('register', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done) => {
        user_check = await User.findOne({ "email": email })
        if (user_check) {
            return done(true, null, null)
        }
        try {
            const user = await User.create({ email, password });

            return done(null, user, { "message": "Signup successful" });
        } catch (error) {
            done(error);
        }
    }
));

/*
 * login module
 * generate token againest sucessfull login
 */
passport.use(
    'login',
    new localStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async(email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                const validate = await user.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                return done(null, user, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

/*
 * token validator for routes
 */
passport.use(
    new JWTstrategy({
            secretOrKey: process.env.TOKEN_SECRET,
            jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken('secret_token')
        },
        async(token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);