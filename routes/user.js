/*jslint node:true*/
'use strict';

var mysql = require('../core/mysql');
var router = require('express').Router();

router.get('/', function (request, response) {
    try {
        var connection = mysql.getConnection();
        mysql.transaction([
            function(callback) {
                connection.query("SELECT b.`betAmount`, b.`betOn`, b.`winAmount` FROM `bet` b WHERE b.`user` = ?", [request.user.id], callback);
            },
            function(bets) {
                var callback = arguments[arguments.length-1];
                var moneyInHand = request.user.balance ? request.user.balance : 0;
                var moneyInBet = 0;
                var moneyWon = 0;
                var moneyLost = 0;

                bets.forEach(bet => {
                    if(bet.winAmount !== null) {
                        if(bet.winAmount > 0) moneyWon += (bet.winAmount - bet.betAmount);
                        else moneyLost += bet.betAmount;
                    } else moneyInBet += bet.betAmount;
                });

                callback(null, request.user.name, moneyInHand, moneyInBet, moneyWon, moneyLost);
            }
        ], connection, function(error, name, moneyInHand, moneyInBet, moneyWon, moneyLost) {
            if(error) return response.status(500).send("Unable to fetch bets.");
            return response.render('pages/users/index', {
                title: "BettingBad : User Home",
                user: {
                    name : name,
                    moneyInHand : moneyInHand,
                    moneyInBet : moneyInBet,
                    moneyWon : moneyWon,
                    moneyLost : moneyLost
                },
                active: "home"
            });
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

router.get('/betzone', function (request, response) {
    try {
        response.render('pages/users/placebet', {
            title: 'BettingBad : Place Bet',
            active: 'bets',
            user: {
                name: request.user.name
            }
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

router.get('/betzone/:match', function (request, response) {
    try {
        response.render('pages/users/placebet', {
            title: 'BettingBad : Place Bet',
            active: 'bets',
            user: {
                name: request.user.name,
                betmatch : request.params.match
            }
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

router.get('/transfer', function(request, response) {
    try {
        response.render('pages/users/transfer', {
            title: 'BettingBad : Transfer Money',
            active: 'transfer',
            user: {
                name: request.user.name,
                balance: request.user.balance
            }
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

module.exports = router;
