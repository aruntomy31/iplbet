/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

function _formatMatches(matches) {
    var respMatches = [];
    matches.forEach(match => {
        var respMatch = {
            id : match.id,
            home : {
                name : match.htn,
                shortName : match.htsn
            },
            away : {
                name : match.atn,
                shortName : match.atsn
            }
        };

        if (match.winner && match.wonby) {
            respMatch.result = {
                won: match.winner,
                by: match.wonby
            };
        } else {
            respMatch.fixture = util.getReadableFixture(match.fixture);
        }

        respMatches.push(respMatch);
    });
    return respMatches;
}

// 1. List of all the matches [/apis/match/all]
router.get('/all', function (request, response) {
    connection.query("SELECT m.`id` AS id, m.`homeTeam` AS htsn, t1.`name` AS htn, m.`awayTeam` AS atsn, t2.`name` AS atn, m.`winner` AS winner, m.`wonBy` AS wonby FROM `match` m, `team` t1, `team` t2 WHERE m.`homeTeam` = t1.`id` AND m.`awayTeam` = t2.`id` ORDER BY `fixture`", function(error, matches) {
        if(error) return response.status(500).send("Unable to get fixtures.");
        return response.status(200).send(JSON.stringify(_formatMatches(matches)));
    });
});

// 2. List of all the undeclared matches [/apis/match/undeclared]
router.get('/undeclared', function (request, response) {
    connection.query("SELECT m.`id` AS id, m.`homeTeam` AS htsn, t1.`name` AS htn, m.`awayTeam` AS atsn, t2.`name` AS atn FROM `match` m, `team` t1, `team` t2 WHERE m.`homeTeam` = t1.`id` AND m.`awayTeam` = t2.`id` AND m.`winner` IS NULL ORDER BY `fixture`", function(error, matches) {
        if(error) return response.status(500).send("Unable to get fixtures.");
        return response.status(200).send(JSON.stringify(_formatMatches(matches)));
    });
});

module.exports = router;