/*jslint node:true*/

// Basic Requirements
var fs = require('fs');
var path = require("path");
var logger = require("morgan");
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var favicon = require("serve-favicon");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var MongooseStore = require('connect-mongo')(session);

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(require('./config/mongo').uri);

// Express Server
var app = express();

// Middlewares
app.use(express.static(__dirname + '/public'));
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    store: new MongooseStore({
        mongooseConnection: mongoose.connection,
        ttl: 1 * 60
    })
}));

// Authentications
require('./config/passport')(app, passport); // Initialize Passport with Strategy and Authentication Routes

// Route Definitions
var router = require('./routes/router');

// Route Inclusions
app.use('/', router);

// 'views' is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
