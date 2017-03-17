/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. View all bets [/apis/bet/all]
router.get('/all', util.checkAdmin, function (request, response) {
    connection.query("SELECT u.`name`, p.`displayName` AS potName, b.`betOn` AS betOn, b.`betTeam` AS betIcon, b.`betAmount` AS betAmount, b.`betTime` AS betDate, (CASE b.`winner` WHEN b.`betOn` THEN CONCAT('Won ', b.`winAmount`) ELSE CONCAT('Lost ', b.`betAmount`) END) AS result, u.`balance` FROM `bet` b, `user` u, `match` m, `pot` p WHERE b.`user` = u.`id` AND b.`match` = m.`id` AND b.`pot` = p.`id` ORDER BY u.`name`, m.`fixture`, p.`displayName`, b.`betTime`", function(error, bets) {
        if(error) return response.status(500).send("Unable to fetch bets.");
        return response.status(200).send(JSON.stringify(bets));
    });
});

// 2. View all bets for a pot [/apis/bet/pot/:potId]
router.get('/pot/:potId', util.checkAdmin, function (request, response) {
    var potId = request.params.potId;
    if(!potId) return response.status(500).send("Please provide Pot ID");
    connection.query("SELECT u.`name`, p.`displayName` AS potName, b.`betOn` AS betOn, b.`betTeam` AS betIcon, b.`betAmount` AS betAmount, b.`betTime` AS betDate, (CASE b.`winner` WHEN b.`betOn` THEN CONCAT('Won ', b.`winAmount`) ELSE CONCAT('Lost ', b.`betAmount`) END) AS result, u.`balance` FROM `bet` b, `user` u, `match` m, `pot` p WHERE b.`user` = u.`id` AND b.`match` = m.`id` AND b.`pot` = p.`id` AND b.`pot` = ? ORDER BY u.`name`, m.`fixture`, p.`displayName`, b.`betTime`", potId, function(error, bets) {
        if(error) return response.status(500).send("Unable to fetch bets.");
        return response.status(200).send(JSON.stringify(bets));
    });
});

// 3. View all bets for a user [/apis/bet/user]
router.get('/user', util.checkUser, function (request, response) {
    connection.query("SELECT p.`displayName` AS potName, b.`betOn` AS betOn, b.`betTeam` AS betIcon, b.`betAmount` AS betAmount, b.`betTime` AS betDate, (CASE b.`winner` WHEN b.`betOn` THEN CONCAT('Won ', b.`winAmount`) ELSE CONCAT('Lost ', b.`betAmount`) END) AS result FROM `bet` b, `match` m, `pot` p WHERE b.`match` = m.`id` AND b.`pot` = p.`id` AND `user` = ? ORDER BY m.`fixture`, p.`displayName`, b.`betTime`", request.user.id, function(error, bets) {
        if(error) return response.status(500).send("Unable to fetch bets.");
        return response.status(200).send(JSON.stringify(bets));
    });
});

// 4. Place a new bet [/apis/bet/place]
router.post('/place', util.checkActiveUser, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data) {
        return response.status(500).send("Please provide appropriate data");
    }
    
    // Validate Data... and implement RollBack
    
    // ================== RETHINK LOGIC ==================
    
    /*
    Pot.findById(data.potId, function (error, pot) {
        if (error) {
            return response.status(500).send("Unable to fetch the pot.");
        }
        
        var multiplier = 1;
        if(pot.isTeamLevel === true) {
            if(data.betOn === pot.match.homeTeam.name) {
                multiplier = pot.multiplierHome;
            } else if(data.betOn === pot.match.awayTeam.name) {
                multiplier = pot.multiplierAway;
            }
        }
        
        User.findOne({ id: request.user.id }, function(error, user) {
            if(error) return response.status(500).send("Unable to fetch user data");
            user.balance -= data.betAmount;
            user.save(function(error) {
                if(error) return response.status(500).send("Unable to save user data");
                
                Bet.create({
                    pot: pot,
                    user: request.user,
                    betOn: data.betOn,
                    betTime: new Date(),
                    betAmount: data.betAmount,
                    multiplier: multiplier
                }, function (error, bet) {
                    if(error) return response.status(500).send("Unable to place the bet.");
                    Transaction.create({
                        from: request.user,
                        to: pot.match ? pot.match._id : null,
                        type: "Bet",
                        time: bet.betTime,
                        amount: bet.betAmount
                    }, function (error, transaction) {
                        if(error) return response.status(500).send("Unable to create a transaction");
                        response.status(200).send("Bet placed successfully.");
                    });
                });
            });
        });
    });
    */
});

module.exports = router;