var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
// authentication for the API 
require('./auth/auth');
// environment variable
require('dotenv').config()
    // Mongodb connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

// routers for the api
var apartmentsRoute = require('./routes/aparments');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet())
app.use(cors())

app.use('/users', usersRouter);
app.use('/', passport.authenticate('jwt', { session: false }), apartmentsRoute);

// 404 handel
app.get("*", (req, res, next) => {
    return res.status(404).send({
        "msg": "Api route not found"
    })
})
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});
module.exports = app;