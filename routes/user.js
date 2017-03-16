/*jslint node:true*/
'use strict';

var connection = require('../core/mysql').connection;
var router = require('express').Router();

router.get('/', function (request, response) {
    connection.query("SELECT `betAmount`, `winner`, `betOn`, `winAmount` FROM `bet` WHERE `user` = ?", request.user.id, function(error, bets) {
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

router.get('/betzone/:match', function (request, response) {
    response.render('pages/users/placebet', {
        title: 'BettingBad : Place Bet',
        active: 'bets',
        user: {
            name: request.user.name,
            betmatch : request.params['match']
        }
    });
});

module.exports = router;
