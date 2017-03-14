/*jslint node:true*/
'use strict';

var fs = require('fs');
var backup = require('mongodb-backup');
var restore = require('mongodb-restore');

var util = require('../util');
var mongo = require('../config/mongo');

// Schemas

var User = require('../db/User');
var Team = require('../db/Team');
var Match = require('../db/Match');
var Player = require('../db/Player');
var BattingStats = require('../db/BattingStatistics');
var BowlingStats = require('../db/BowlingStatistics');

var router = require('express').Router();

router.get('/', function(request, response) {
    // Render Admin Dashboard
    
    var output  = "Admin Dashboard. <br>"
        + "<a href='/admin/initializeTeams'>Initialize Teams and Players</a><br>"
        + "<a href='/admin/initializeFixtures'>Initialize Fixtures</a><br>"
        + "<a href='/admin/backup'>Backup MongoDB</a><br>"
        + "<a href='/admin/restore'>Restore MongoDB</a><br>";
    
    response.status(200).send(output);
});

router.get('/backup', function(request, response) {
    backup(mongo);
    response.status(200).send("Backup Successful");
});

router.get('/restore', function(request, response) {
    restore(mongo);
    response.status(200).send("Restore Successful");
});

router.get('/initializeTeams', function(request, response) {
    var teams = require('../config/team');
    for(var shortName in teams) {
        Team.create({
            id               : shortName,
            name             : teams[shortName].name,
            logo             : teams[shortName].logo,
            currentPosition  : teams[shortName].currentPosition,
            positionLastYear : teams[shortName].positionLastYear,
            titles           : teams[shortName].titles
        }, function(error, team) {
            for(var playerName of teams[team.id].players) {
                Player.create({
                    name    : playerName,
                    team    : team,
                    matches : 0
                }, function(error, player) {
                    Team.findById(player.team, function(error, team) {
                        team.players.push(player);
                        team.save();
                    });
                });
            }
            
        });
    }
    response.status(200).send("All Teams and Players initialized.");
});

router.get('/initializeFixtures', function(request, response) {
    var fixtures = require('../config/fixtures');
    fixtures.forEach(fixture => {
        Team.findOne({ id: fixture.home }, function(error, homeTeam) {
            Team.findOne({ id: fixture.away }, function(error, awayTeam) {
                Match.create({
                    name: fixture.home + " vs " + fixture.away,
                    homeTeam: homeTeam,
                    awayTeam: awayTeam,
                    fixture: util.getIPLDate(fixture.fixture)
                }, function(error, match) {
                    if(error) console.log("Unable to save match: " + error);
                });
            });
        });
    });
    response.status(200).send("Fixtures Initialized Successfully");
});

module.exports = router;