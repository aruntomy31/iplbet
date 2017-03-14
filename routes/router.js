/*jslint node:true*/
'use strict';

var util   = require('../util');
var router = require('express').Router();

// Schema
var User = require('../db/User');

// Various Routes
var iplRoutes   = require('./ipl');
var apiRoutes   = require('./apis');
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

router.use('/ipl', iplRoutes);

router.use('/apis', apiRoutes);

router.use('/teams', teamRoutes);

router.use('/users', util.ensureAuthenticated, userRoutes);

router.use('/admin', util.ensureAuthenticated, util.checkAdmin, adminRoutes);

router.get('/login', function(request, response) {
    
    var output  = "<a href='/auth/google'>Login with Google</a><br>"
        + "<a href='/auth/twitter'>Login with Twitter</a><br>"
        + "<a href='/auth/facebook'>Login with Facebook</a><br>";
    
    response.status(500).send(output);
});

module.exports = router;