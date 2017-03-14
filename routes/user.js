/*jslint node:true*/
'use strict';

var router = require('express').Router();

var User = require('../db/User');

router.get('/', function(request, response) {
    // Render User Landing Page
    
    var output  = "User Dashboard. <br>"
        + "<a href='/logout'>Logout</a><br>";
        
    response.status(200).send(output);
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