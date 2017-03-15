/*jslint node:true*/
'use strict';

var util = require('../util');
var router = require('express').Router();

// Schema
var User = require('../db/User');

// Various Routes
var iplRoutes = require('./ipl');
var apiRoutes = require('./apis');
var teamRoutes = require('./team');
var userRoutes = require('./user');
var adminRoutes = require('./admin');

router.get('/', function (request, response) {
    response.render('pages/index', {
        title: 'BettingBad : Home',
        active: 'home'
    });
});

router.get('/privacy', function(request, response) {
    response.status(200).send("Privacy Policy");
});

router.get('/terms', function(request, response) {
    response.status(200).send("Terms and Conditions");
});

router.get('/fixtures', function (request, response) {
    response.render('pages/fixtures', {
        title: 'BettingBad : Fixtures',
        active: 'fixtures'
    });
});

router.get('/rules', function (request, response) {
    response.render('pages/rules', {
        title: 'BettingBad : Rules',
        active: 'rules'
    });
});

router.get('/prizes', function (request, response) {
    response.render('pages/prizes', {
        title: 'BettingBad : Prizes',
        active: 'prizes'
    });
});

router.get('/stats', function (request, response) {
    response.render('pages/stats', {
        title: 'BettingBad : Statistics',
        active: 'stats'
    });
});


router.use('/ipl', iplRoutes);

router.use('/apis', apiRoutes);

router.use('/teams', teamRoutes);

router.use('/users', util.checkUser, userRoutes);

router.use('/admin', util.checkAdmin, adminRoutes);

router.get('/login', function (request, response) {

    var output = "<a href='/auth/google'>Login with Google</a><br>" + "<a href='/auth/twitter'>Login with Twitter</a><br>" + "<a href='/auth/facebook'>Login with Facebook</a><br>";

    response.status(500).send(output);
});

module.exports = router;
