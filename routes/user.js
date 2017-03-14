/*jslint node:true*/
'use strict';

var router = require('express').Router();

var User = require('../db/User');

router.get('/', function (request, response) {
    response.render('pages/users/index', {
        title: 'BettingBad : User Home',
        user: {
            name: request.user.name,
            moneyInHand: request.user.balance,
            moneyInBet: 100000,
            moneyWon: 223492,
            moneyLost: 234234
        },
        active: 'home'
    });
});

router.get('/profile', function (request, response) {
    // Render User Profile Page (Same as landing page?)
    response.status(200).send("User Profile Page");
});

router.get('/betzone', function (request, response) {
    // Two Views : Place Bets (New Bets) & Placed Bets (Old Bets)
    response.status(200).send("User Betting Zone");
});

module.exports = router;
