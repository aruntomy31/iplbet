/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. List of all the players [/apis/player/all]
router.get('/all', function (request, response) {
    connection.query("SELECT * FROM `player`", function(error, players) {
        if (error) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 2. List of all the players in a team [/apis/player/team/:team]
router.get('/team/:team', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    connection.query("SELECT * FROM `player` WHERE `team` = ?", team, function(error, players) {
        if (error) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 3. List of all the players in a match [/apis/player/match/:matchId]
router.get('/match/:matchId', function (request, response) {
    var matchId = request.params.matchId;
    if (!matchId) return response.status(500).send("Please provide Match ID");
    connection.query("SELECT p.* FROM `player` p, `match` m WHERE (p.`team` = m.`homeTeam` OR p.`team` = m.`awayTeam`) AND m.`id` = ?", matchId, function(error, match) {
        if (error) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

module.exports = router;