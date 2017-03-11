/*jslint node:true*/
'use strict';

var router = require('express').Router();

// Schema
var User = require('../db/User');

// Various Routes
var teamRoutes  = require('./team');
var userRoutes  = require('./user');
var adminRoutes = require('./admin');

router.get('/', function(request, response) {
    response.render('pages/index');
});

router.get('/fixtures', function(request, response) {
    // Render Fixtures Page
    response.status(200).send("Fixtures Page");
});

router.get('/rules', function(request, response) {
    // Render Rules Page
    response.status(200).send("Rules Page");
});

router.get('/prizes', function(request, response) {
    // Render Prizes Page
    response.status(200).send("Prizes Page");
});

router.use('/teams', teamRoutes);

router.use('/users', _ensureAuthenticated, userRoutes);

router.use('/admin', _ensureAuthenticated, _checkAdmin, adminRoutes);

router.get('/login', function(request, response, next) {
    response.status(500).send('Failed');
});

// Private Functions
function _ensureAuthenticated(request, response, next) {
    // Check if request contains session user variable
    if(request.isAuthenticated() === true) {
        // -> Check if user exists in DB
        User.find({ id : request.user.id }, function(error, user) {
            if(error || user.length === 0) { console.log(error); response.redirect('/login'); }
            else {
                // User Exists
                user = user[0];
                if(user.admin === true && request.baseUrl === '/users') response.redirect('/admin');
                else if(user.admin === false && request.baseUrl === '/admin') response.redirect('/users');
                else return next();
            }
        });
    } else response.redirect('/login');
}

function _checkAdmin(request, response, next) {
    User.find({ id: request.user.id, admin: true }, function(error, user) {
        if(error || user.length === 0) {
            response.redirect('/login');
        } else return next();
    });
}

module.exports = router;
