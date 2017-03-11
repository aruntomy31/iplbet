/*jslint node:true*/
'use strict';

var mongo = require('../config/mongo');

var backup = require('mongodb-backup');
var restore = require('mongodb-restore');

// Schemas

var User = require('../db/User');
var Team = require('../db/Team');
var Player = require('../db/Player');
var BattingStats = require('../db/BattingStatistics');
var BowlingStats = require('../db/BowlingStatistics');

var router = require('express').Router();

router.get('/', function(request, response) {
    // Render Admin Dashboard
    response.status(200).send("Admin Dashboard");
});

router.get('/backup', function(request, response) {
    backup({
        uri  : mongo.uri,
        root : mongo.root,
        tar  : mongo.tar
    });
    response.status(200).send("Backup Successful");
});

router.get('/initialize', function(request, response) {
    
    var teams = require('../config/team');
    for(var shortName in teams) {
        var team = new Team({
            id: shortName,
            name: teams[shortName].name,
            logo: teams[shortName].logo,
            positionLastYear: teams[shortName].positionLastYear,
            titles: teams[shortName].titles
        });
        
        team.save(function(error, team) {
            if(error) {
                console.log("Unable to save team [" + shortName + "]");
                response.redirect('/admin');
                return;
            }
            for(var playerName of teams[shortName].players) {
                var player = new Player({
                    name: playerName,
                    team: team._id,
                    matches: 0
                });
                
                player.save(function(error, player) {
                    if(error) {
                        console.log("Unable to save player [" + playerName + "] of team [" + shortName + "]");
                        response.redirect('/admin');
                        return;
                    }
                    
                    team.players.push(player._id);
                    team.save(function(error, team) {
                        if(error) {
                            console.log("Unable to add player [" + playerName + "] to team [" + shortName + "]");
                            response.redirect('/admin');
                            return;
                        }
                    });
                });
            }
        });
    }
    
});

module.exports = router;