var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
require('./auth/auth');
require('dotenv').config()
    // Mongodb connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

// routers for the api
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())
app.use(cors())
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});
app.use('/users', usersRouter);
app.use('/', passport.authenticate('jwt', { session: false }), indexRouter);


module.exports = app;