/*jslint node:true*/
'use strict';

var util = require('../../util');
var router = require('express').Router();

// Schemas

var Match = require('../../db/Match');

// 1. List of all the matches [/apis/match/all]
router.get('/all', function (request, response) {
    Match.find({}).sort({ fixture: 1 }).exec(function (error, matches) {
        if (error) {
            return response.status(500).send("Unable to get fixtures.");
        }
        
        var respMatches = [];
        matches.forEach(match => {
            var respMatch = {
                id : match._id,
                home : {
                    name : match.homeTeam.name,
                    shortName : match.homeTeam.id
                },
                away : {
                    name : match.awayTeam.name,
                    shortName : match.awayTeam.id
                }
            };
            
            if (match.winner && match.wonBy) {
                respMatch.result = {
                    won: match.winner,
                    by: match.wonBy
                };
            } else {
                respMatch.fixture = util.getReadableFixture(match.fixture);
            }
            
            respMatches.push(respMatch);
        });
        
        return response.status(200).send(JSON.stringify(respMatches));
    });
});

// 2. List of all the undeclared matches [/apis/match/undeclared]
router.get('/undeclared', function (request, response) {
    Match.find({ $or: [
        { winner : undefined },
        { winner : null }
    ] }).sort({ fixture: 1 }).exec(function (error, matches) {
        if (error) {
            return response.status(500).send("Unable to get fixtures.");
        }
        
        var respMatches = [];
        matches.forEach(match => {
            var respMatch = {
                id : match._id,
                home : {
                    name : match.homeTeam.name,
                    shortName : match.homeTeam.id
                },
                away : {
                    name : match.awayTeam.name,
                    shortName : match.awayTeam.id
                }
            };
            
            if (match.winner && match.wonBy) {
                respMatch.result = {
                    won: match.winner,
                    by: match.wonBy
                };
            } else {
                respMatch.fixture = util.getReadableFixture(match.fixture);
            }
            
            respMatches.push(respMatch);
        });
        
        return response.status(200).send(JSON.stringify(respMatches));
    });
});

module.exports = router;