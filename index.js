/*jslint node:true*/
var express = require('express');
var fs = require('fs');
var session = require("express-session");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var passport = require('passport');
var app = express();
var authConfig = require('./config/auth.json');

//Schemas
var connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString);
var User = require('./db/User');

//Route Definitions
var index = require('./routes/index');

//Route inclusions
app.use('/', index);

//Auth
app.use(passport.initialize());
app.use(passport.session());

var GOOGLE_CLIENT_ID = authConfig.google.clientid;
var GOOGLE_CLIENT_SECRET = authConfig.google.clientsecret;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://iplbet.herokuapp.com/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
}));

app.get('/auth/google', passport.authenticate('google', {
    scope: ['email profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log('Authenticated.');
        User.find({
            $or: [{
                id: req.user.id
            }, {
                email: req.user.emails[0].value
            }]
        }, function (error, result) {
            if (error) {
                console.log("Error in searching. " + error);
                res.redirect("/login");
            }
            if (result.length === 1) {
                res.redirect("/users");
            } else if (result.length === 0) {
                var newUser = new User({
                    id: req.user.id,
                    name: req.user.displayName,
                    email: req.user.emails[0].value,
                    photoURL: req.user.photos ? req.user.photos[0].value : "http://placehold.it/200x200",
                    admin: false
                });
                newUser.save(function (err) {
                    if (err) {
                        console.log("Error in inserting user data. " + err);
                        res.redirect("/login");
                    }
                    res.redirect("/users");
                });
            } else {
                res.redirect("/login");
            }
        });
    });



app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
