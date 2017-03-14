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
        suspended : true,
        balance : 0
    });
}

function checkUserExistOrAdd(user, done) {
    User.findOne({ $or : [
        { id: user.id },
        { email: user.email }
    ] }, function(error, userFound) {
        if(error) return done(error, null);
        if(!userFound) {
            user.save(function(error, userCreated) {
                if(error) return done(error, null);
                return done(null, userCreated);
            });
        }
        return done(null, userFound);
    });
}

module.exports = function(app, passport) {
    
    app.use(passport.initialize());
    
    app.use(passport.session());
    
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function(user, done) {
        User.findById(user, function(error, userFound) {
            done(error, userFound);
        });
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
    
    var redirect = {
        successRedirect: '/users',
        failureRedirect: '/login'
    };
    
    var redirectIfAuthenticated = function(request, response, next) {
        if(request.isAuthenticated()) response.redirect(redirect.successRedirect);
        else return next();
    };
    
    // Google Authentication Route & Callback
    
    app.get('/auth/google', redirectIfAuthenticated, passport.authenticate('google', { scope: ['profile', 'email'] }));
    
    app.get('/auth/google/callback', passport.authenticate('google', redirect));
    
    // Facebook Authentication Route & Callback
    
    app.get('/auth/facebook', redirectIfAuthenticated, passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook', redirect));
    
    // Twitter Authentication Route & Callback
    
    app.get('/auth/twitter', redirectIfAuthenticated, passport.authenticate('twitter'));
    
    app.get('/auth/twitter/callback', passport.authenticate('twitter', redirect));
    
    app.get('/logout', function(request, response) {
        request.logout();
        
        var output  = "Logged Out. <br>"
            + "<a href='/auth/google'>Login with Google</a><br>"
            + "<a href='/auth/twitter'>Login with Twitter</a><br>"
            + "<a href='/auth/facebook'>Login with Facebook</a><br>";
        
        response.status(200).send(output);
    });
    
};