/*jslint node:true*/
'use strict';

var router = require('express').Router();

var User = require('../db/User');

router.get('/', function(request, response) {
    // Render User Landing Page
    response.status(200).send("User Landing Page");
});

router.get('/profile', function(request, response) {
    // Render User Profile Page (Same as landing page?)
    response.status(200).send("User Profile Page");
});

router.get('/betzone', function(request, response) {
    // Two Views : Place Bets (New Bets) & Placed Bets (Old Bets)
    response.status(200).send("User Betting Zone");
});

module.exports = router;