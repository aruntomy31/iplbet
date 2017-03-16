/*jslint node:true*/
'use strict';

var util = require('../core/util');
var router = require('express').Router();

// Various Routes
var iplRoutes = require('./ipl');
var apiRoutes = require('./apis');
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

router.get('/error', function(request, response){
    response.render('pages/error', {
        title: 'Error',
        active: ''
    });
});


router.use('/ipl', iplRoutes);

router.use('/apis', apiRoutes);

router.use('/users', util.checkUser, userRoutes);

router.use('/admin', util.checkAdmin, adminRoutes);

module.exports = router;
