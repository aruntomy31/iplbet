/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. List of all the pots [/apis/pot/all]
router.get('/all', function (request, response) {
    connection.query("SELECT * FROM `pot`", function(error, pots) {
        if(error) return response.status(500).send("Unable to fetch pots.");
        response.status(200).send(JSON.stringify(pots));
    });
});

// 2. List of all the pots open for betting [/apis/pot/open]
router.get('/open', function (request, response) {
    connection.query("SELECT * FROM `pot` WHERE `openTime` <= CURRENT_TIMESTAMP AND `closeTime` >= CURRENT_TIMESTAMP", function(error, pots) {
        if(error) return response.status(500).send("Unable to fetch pots.");
        response.status(200).send(JSON.stringify(pots));
    });
});

// 3. List of all the pots closed for betting [/apis/pot/closed]
router.get('/closed', function (request, response) {
    connection.query("SELECT * FROM `pot` WHERE `closeTime` < CURRENT_TIMESTAMP", function(error, pots) {
        if(error) return response.status(500).send("Unable to fetch pots.");
        response.status(200).send(JSON.stringify(pots));
    });
});

// 4. List of all the pots for a match [/apis/pot/match/:matchId]
router.get('/match/:matchId', function (request, response) {
    var matchId = request.params.matchId;
    if(!matchId) return response.status(500).send("Please provide Match ID");
    
    connection.query("SELECT * FROM `pot` WHERE `match` = ?", matchId, function(error, pots) {
        if(error) return response.status(500).send("Unable to fetch pots.");
        response.status(200).send(JSON.stringify(pots));
    });
});

// 5. Add new pot [/apis/pot/add]
router.post('/add', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data) {
        return response.status(500).send("Please provide appropriate data");
    }
    
    // Validate Data... and implement RollBack
    
    // ================== RETHINK LOGIC ==================
    
    /*
    Match.findById(data.matchId, function (error, match) {
        if (error) {
            return response.status(500).send("Unable to fetch the match.");
        }
        Pot.create({
            name: data.name,
            openTime: data.openTime,
            closeTime: data.closeTime,
            match: match,
            isTeamLevel: data.isTeamLevel,
            multiplierHome: data.multiplierHome,
            multiplierAway: data.multiplierAway
        }, function (error) {
            if (error) {
                return response.status(500).send("Unable to create new pot.");
            }
            response.status(200).send("New Pot Created.");
        });
    });
    */
});

module.exports = router;