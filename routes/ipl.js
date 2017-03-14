/*jslint node:true*/
'use strict';

var router = require('express').Router();

// IPL T20 APIs - 2016
var http = require("http");
var concat = require("concat-stream");

function toJson(request, response, url) {
    http.get("http://datacdn.iplt20.com/dynamic/data/core/cricket/2012/ipl2016/" + url + ".js", res => {
        res.pipe(concat({ encoding: 'string' }, function(string) {
            return response.status(200).send(string.slice(string.indexOf('(')+1, string.lastIndexOf(')')));
        }));
    });
}

// 1. Group Standings
router.get('/standings', toJson(request, response, "groupStandings"));

// 2. Most Runs
router.get('/most-runs', toJson(request, response, "stats/player/full/mostRuns"));

// 3. Most Sixes
router.get('/most-sixes', toJson(request, response, "stats/player/full/mostSixes"));

// 4. Highest Scores
router.get('/highest-scores', toJson(request, response, "stats/player/full/highestScoresInnings"));

// 5. Best Batting Strike Rate
router.get('/best-batting-strike-rate', toJson(request, response, "stats/player/full/bestBattingStrikeRate"));

// 6. Most Wickets
router.get('/most-wickets', toJson(request, response, "stats/player/full/mostWickets"));

// 7. Best Bowling Innings
router.get('/best-bowling-innings', toJson(request, response, "stats/player/full/bestBowlingInnings"));

// 8. Best Bowling Average
router.get('/best-bowling-average', toJson(request, response, "stats/player/full/bestBowlingAverage"));

// 9. Best Bowling Economy
router.get('/best-bowling-economy', toJson(request, response, "stats/player/full/bestBowlingEconomy"));

module.exports = router;