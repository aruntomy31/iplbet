/*jslint node:true*/

var configuration = require('./auth');

var Strategy = {
    Google   : require('passport-google-oauth').OAuth2Strategy,
    Facebook : require('passport-facebook').Strategy,
    Twitter  : require('passport-twitter').Strategy
};

var User = require('../db/User');

function _createUserObject(id, name, email, image) {
    return new User({
        id        : id,
        name      : name,
        email     : email,
        image     : image ? image : "http://placehold.it/200x200",
        admin     : false,
        suspended : true
    });
}

function checkUserExistOrAdd(user, done) {
    User.find({ $or : [
        { id: user.id },
        { email: user.email }
    ] }, function(error, users) {
        if(error) done(error, null);
        else {
            if(users.length === 0) {
                user.save(function(error, user) {
                    if(error) done(error, null);
                    else done(null, user);
                });
            } else done(null, users[0]);
        }
    });
}

module.exports = function(app, passport) {
    
    app.use(passport.initialize());
    
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.use(new Strategy.Google({
        clientID     : configuration.google.clientID,
        clientSecret : configuration.google.clientSecret,
        callbackURL  : configuration.google.callbackURL
    }, function(token, refreshToken, user, done) {
        checkUserExistOrAdd(_createUserObject(user.id, user.name.givenName + ' ' + user.name.familyName, user.emails[0].value, user.photos[0].value), done);
    }));
    
    passport.use(new Strategy.Facebook({
        clientID      : configuration.facebook.clientID,
        clientSecret  : configuration.facebook.clientSecret,
        callbackURL   : configuration.facebook.callbackURL,
        profileFields : [ 'id', 'emails', 'name', 'displayName', 'gender' ]
    }, function(token, refreshToken, user, done) {
        checkUserExistOrAdd(_createUserObject(user.id, user.displayName, user.emails[0].value, user.photos[0].value), done);
    }));
    
    passport.use(new Strategy.Twitter({
        consumerKey    : configuration.twitter.consumerKey,
        consumerSecret : configuration.twitter.consumerSecret,
        callbackURL    : configuration.twitter.callbackURL,
        includeEmail   : true
    }, function(token, tokenSecret, user, done) {
        checkUserExistOrAdd(_createUserObject(user.id, user.displayName, user.emails[0].value, user.photos[0].value), done);
    }));
    
    var failRedirect = { failureRedirect: '/login' };
    
    var redirectIfAuthenticated = function(request, response, next) {
        if(request.isAuthenticated()) authCallback(request, response);
        else return next();
    };
    
    var authCallback = function(request, response) {
        if(request.user) {
            if(request.user.admin === true) response.redirect("/admin");
            else response.redirect("/users");
        } else response.redirect("/login");
    };
    
    // Google Authentication Route & Callback
    
    app.get('/auth/google', redirectIfAuthenticated, passport.authenticate('google', { scope: ['email profile'] }));
    
    app.get('/auth/google/callback', passport.authenticate('google', failRedirect), authCallback);
    
    // Facebook Authentication Route & Callback
    
    app.get('/auth/facebook', redirectIfAuthenticated, passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook', failRedirect), authCallback);
    
    // Twitter Authentication Route & Callback
    
    app.get('/auth/twitter', redirectIfAuthenticated, passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback', passport.authenticate('twitter', failRedirect), authCallback);
    
    app.get('/logout', function(request, response) {
        request.logout();
        response.redirect('/');
    });
    
};