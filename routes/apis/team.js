/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. List of All Teams [/apis/team/all]
router.get('/all', function (request, response) {
    // captain...
    connection.query("SELECT `id`, `name`, `positionLastYear`, `titles`, `id` AS shortName FROM `team`", function(error, teams) {
        if(error) response.status(500).send("Unable to fetch teams.");
        response.status(200).send(JSON.stringify(teams));
    });
});

// 2. List of Teams involved in a match [/apis/team/match/:matchId]
router.get('/match/:matchId', function(request, response) {
    var matchId = request.params.matchId;
    if (!matchId) return response.status(500).send("Please provide Match ID");
    
    connection.query("SELECT m.`homeTeam` AS htsn, t1.`name` AS htn, m.`awayTeam` AS atsn, t2.`name` AS atn FROM `match` m, `team` t1, `team` t2 WHERE m.`homeTeam` = t1.`id` AND m.`awayTeam` = t2.`id` AND m.`id` = ?", matchId, function(error, match) {
        if (error) return response.status(500).send("Unable to fetch the match.");
        var teams = [
            { id: match[0].htsn, name: match[0].htn },
            { id: match[0].atsn, name: match[0].atn }
        ];
        response.status(200).send(JSON.stringify(teams));
    });
});

// 3. Details of a specific team [/apis/team/:team]
router.get('/:team', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    
    connection.query("SELECT `name`, `positionLastYear`, `titles` FROM `team` WHERE `id` = ?", team, function(error, team) {
        if (error) return response.status(500).send("Invalid Team");
        response.status(200).send(JSON.stringify(team));
    });
});

module.exports = router;