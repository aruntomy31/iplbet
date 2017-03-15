/*jslint node:true*/
'use strict';

var util = require('../../util');
var router = require('express').Router();

// Schemas

var Team = require('../../db/Team');
var Match = require('../../db/Match');

// 1. List of All Teams [/apis/team/all]
router.get('/all', function (request, response) {
    Team.find({}, { id: 1, name: 1, currentPosition: 1, positionLastYear: 1, titles: 1, players: 1, _id: 0 }, function (error, teams) {
        response.status(200).send(JSON.stringify(teams));
    });
});

// 2. List of Teams involved in a match [/apis/team/match/:matchId]
router.get('/match/:matchId', function(request, response) {
    var matchId = request.params.matchId;
    if (!matchId) return response.status(500).send("Please provide Match ID");
    Match.findById(matchId, function (error, match) {
        if (error || !match) return response.status(500).send("Unable to fetch the match.");
        var teams = [
            {
                id: match.homeTeam.id,
                name: match.homeTeam.name
            }, {
                id: match.awayTeam.id,
                name: match.awayTeam.name
            }
        ];
        response.status(200).send(JSON.stringify(teams));
    });
});

// 3. Details of a specific team [/apis/team/:team]
router.get('/:team', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    Team.findOne({ "id": team }, { id: 1, name: 1, positionLastYear: 1, titles: 1, players: 1, _id: 0 }, function (error, team) {
        if (error || !team) return response.status(500).send("Invalid Team");
        response.status(200).send(JSON.stringify(team));
    });
});

module.exports = router;