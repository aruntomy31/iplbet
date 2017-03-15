/*jslint node:true*/
'use strict';

var router = require('express').Router();

var User = require('../db/User');

router.get('/', function (request, response) {
    Bet.find({ "user.id" : request.user.name }, function(error, bets) {
        if(error) return response.status(500).send("Unable to fetch bets.");
        
        var moneyInHand = request.user.balance ? request.user.balance : 0;
        var moneyInBet = 0;
        var moneyWon = 0;
        var moneyLost = 0;
        
        bets.forEach(bet => {
            moneyInBet += bet.betAmount;
            if(bet.winner) {
                if(bet.winner === bet.betOn) {
                    moneyWon += (bet.winAmount - bet.betAmount);
                } else {
                    moneyLost += bet.betAmount;
                }
            } else {
                moneyInBet += bet.betAmount;
            }
        });
        
        response.render('pages/users/index', {
            title: 'BettingBad : User Home',
            user: {
                name: request.user.name,
                moneyInHand: moneyInHand,
                moneyInBet: moneyInBet,
                moneyWon: moneyWon,
                moneyLost: moneyLost
            },
            active: 'home'
        });
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
