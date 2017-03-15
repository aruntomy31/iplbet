/*jslint node:true*/
'use strict';

var util = require('../../util');
var router = require('express').Router();

// Schemas

var Player = require('../../db/Player');
var Match = require('../../db/Match');

// 1. List of all the players [/apis/player/all]
router.get('/all', function (request, response) {
    Player.find({}, function (error, players) {
        if (error || !players) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 2. List of all the players in a team [/apis/player/team/:team]
router.get('/team/:team', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    Player.find({ "team.id": team }, { name: 1, photo: 1, matches: 1, _id: 1}, function (error, players) {
        if (error || !players) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 3. List of all the players in a match [/apis/player/match/:matchId]
router.get('/match/:matchId', function (request, response) {
    var matchId = request.params.matchId;
    if (!matchId) return response.status(500).send("Please provide Match ID");
    Match.findById(matchId, function (error, match) {
        if (error || !match) return response.status(500).send("Unable to fetch the match.");
        var players = [];
        for (var player of match.homeTeam.players) {
            players.push(player);
        }
        for (var player of match.awayTeam.players) {
            players.push(player);
        }
        response.status(200).send(JSON.stringify(players));
    });
});

module.exports = router;