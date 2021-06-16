const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const api_doc=require('./openapi.json');
// authentication for the API
require('./auth/auth');

// environment variable
require('dotenv').config()

// Mongodb connection
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connection.on('error', error => console.log(error));
mongoose.Promise = global.Promise;

// routers for the api
const apartmentsRoute = require('./routes/aparments');
const usersRouter = require('./routes/users');
const favoriteRouter = require('./routes/favorite');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet())
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(api_doc));
app.use('/users', usersRouter);
app.use('/apartments', passport.authenticate('jwt', { session: false }), apartmentsRoute);
app.use('/users/favorite', passport.authenticate('jwt', { session: false }), favoriteRouter);

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