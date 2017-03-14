/*jslint node:true*/
'use strict';

var util = require('../util');
var router = require('express').Router();

// Schemas

var Bet = require('../db/Bet');
var Pot = require('../db/Pot');
var User = require('../db/User');
var Team = require('../db/Team');
var Match = require('../db/Match');
var Player = require('../db/Player');
var Transaction = require('../db/Transaction');
var TeamStats = require('../db/TeamStatistics');
var BattingStats = require('../db/BattingStatistics');
var BowlingStats = require('../db/BowlingStatistics');
var FieldingStats = require('../db/FieldingStatistics');

// User APIs

// 1. List of All Users
router.get('/users', util.ensureAuthenticated, util.checkAdmin, function (request, response) {
    User.find({}, function (error, users) {
        if (error) {
            return response.status(500).send(error);
        }
        return response.status(200).send(JSON.stringify(users));
    });
});

// 2. List of Active Users
router.get('/active-users', util.ensureAuthenticated, util.checkAdmin, function (request, response) {
    User.find({
        suspended: false
    }, function (error, users) {
        if (error) {
            return response.status(500).send(error);
        }
        return response.status(200).send(JSON.stringify(users));
    });
});

// 3. Activate User with Activation Code [Directly from mail]
router.get('/activate/:user/:code', function (request, response) {
    var userId = request.params.user ? request.params.user : '';
    var code = request.params.code ? request.params.code : '';
    User.findOne({
        id: userId,
        activateCode: code
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Activation Failed. Invalid User.");
        }
        user.suspended = false;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Activation Failed.");
            }
            return response.status(200).send("User Activated.");
        });
    });
});

// 4. Activate User via Admin Login
router.post('/activate', util.ensureAuthenticated, util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    User.findOne({
        id: data.userId
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Activation Failed. Invalid User.");
        }
        user.suspended = false;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Activation Failed.");
            }
            return response.status(200).send("User Activated.");
        });
    });
});

// 5. Deactivate User via Admin Login
router.post('/deactivate', util.ensureAuthenticated, util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    User.findOne({
        id: data.userId
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Deactivation Failed. Invalid User.");
        }
        user.suspended = true;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Deactivation Failed.");
            }
            return response.status(200).send("User Deactivated.");
        });
    });
});

// 6. Update Balance [By Specific Amount] of All Users
router.post('/updateBalanceBy', util.ensureAuthenticated, util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.amount) {
        return response.status(500).send("Provide Amount");
    }
    if (data.amount <= 0) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    User.find({
        suspended: false
    }, function (error, users) {
        if (error || !users) {
            return response.status(500).send("Unable to fetch users.");
        }
        var lastUser = users[users.length - 1];
        for (var user of users) {
            user.balance = user.balance + data.amount;
            user.save(function (error, user) {
                if (error) {
                    return response.status(500).send("Update Balance Failed.");
                }
                if (user._id === lastUser._id) {
                    response.status(200).send("Balance Updated for All Users.");
                }
            });
        }
    });
});

// Team APIs

// 7. List of All Teams
router.get('/teams/:stats', function (request, response) {
    var stats = request.params.stats ? request.params.stats : false;
    var projections = {
        id: 1,
        name: 1,
        currentPosition: 1,
        positionLastYear: 1,
        titles: 1,
        players: 1,
        _id: 0
    };
    if (stats === "true") {
        projects.teamStats = 1;
    }
    Team.find({}, projections, function (error, teams) {
        response.status(200).send(JSON.stringify(teams));
    });
});

// 8. Details of a specific team
router.get('/team/:team', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    Team.findOne({
        "id": team
    }, {
        id: 1,
        name: 1,
        positionLastYear: 1,
        titles: 1,
        _id: 0
    }, function (error, team) {
        if (error || !team) return response.status(500).send("Invalid Team");
        response.status(200).send(JSON.stringify(team));
    });
});

// 9. Update Team Statistics
router.post('/updateTeamStats/:team', function (request, response) {

});

// Player APIs

// 10. List of all the players
router.get('/players/:stats', function (request, response) {
    var stats = request.params.stats ? request.params.stats : false;
    var projections = {
        name: 1,
        photo: 1,
        team: 1,
        matches: 1,
        _id: 0
    };
    if (stats === "true") {
        projections.battingStats = 1;
        projections.bowlingStats = 1;
        projections.fieldingStats = 1;
    }
    Player.find({}, projections, function (error, players) {
        if (error || !players) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 11. List of all the players in a team
router.get('/players/:team/:stats', function (request, response) {
    var team = request.params.team;
    if (!team) return response.status(500).send("Provide Team Short Name");
    var stats = request.params.stats ? request.params.stats : false;
    var projections = {
        name: 1,
        photo: 1,
        matches: 1,
        _id: 0
    };
    if (stats === "true") {
        projections.battingStats = 1;
        projections.bowlingStats = 1;
        projections.fieldingStats = 1;
    }
    Player.find({
        "team.id": team
    }, projections, function (error, players) {
        if (error || !players) return response.status(500).send("Invalid Team: " + error);
        return response.status(200).send(JSON.stringify(players));
    });
});

// 12. List of all the players in a match
router.get('/matchPlayers/:matchId', function (request, response) {
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

// 13. Update Player Statistics
router.post('/updatePlayerStats/:playerId', function (request, response) {
    var playerId = request.params.playerId;
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !playerId) return response.status(500).send("Please provide appropriate data");
    Player.findById(playerId, function (error, player) {
        if (error) return response.status(500).send("Unable to fetch the player.");

        // Update Batting Statistics
        if (!player.battingStats) player.battingStats = new BattingStats({});
        var batStatKeys = ["notOuts", "runsScored", "strikeRate", "highScore", "hundreds", "fifties", "fours", "sixes"];
        for (var key of batStatKeys) {
            player.battingStats[key] = player.battingStats[key] ? player.battingStats[key] + data[key] : data[key];
        }

        // Update Bowling Statistics
        if (!player.bowlingStats) player.bowlingStats = new BowlingStats({});
        var bowlStatKeys = ["balls", "maidens", "runsConceded", "wickets"];
        for (var key of bowlStatKeys) {
            player.bowlingStats[key] = player.bowlingStats[key] ? player.bowlingStats[key] + data[key] : data[key];
        }
        player.bowlingStats.bestFigures = player.bowlingStats.wickets + "/" + player.bowlingStats.runsConceded;

        // Update Fielding Statistics
        if (!player.fieldingStats) player.fieldingStats = new FieldingStats({});
        var fieldStatKeys = ["catches", "stumpings", "runOuts"];
        for (var key of fieldStatKeys) {
            player.fieldingStats[key] = player.fieldingStats[key] ? player.fieldingStats[key] + data[key] : data[key];
        }

        player.save(function (error) {
            if (error) return response.status(500).send("Unable to update player statistics.");
            response.status(200).send("Player Statistics Updated.");
        });

    });
});

// Match APIs

// 14. List of all the matches
router.get('/matches', function (request, response) {
    Match.find({}, function (error, matches) {
        if (error) {
            return response.status(500).send("Unable to get fixtures.");
        }
        return response.status(200).send(JSON.stringify(matches));
    });
});

// 15. Update winning details of the match
router.post('/update-match/:matchId', function (request, response) {
    var matchId = request.params.matchId;
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !matchId) {
        return response.status(500).send("Please provide appropriate data");
    }
    Match.findById(matchId, function (error, match) {
        if (error) return response.status(500).send("Unable to fetch the match.");
        match.batFirst = data.batFirst;
        match.winner = data.winner;
        match.wonBy = data.wonBy;

        match.save(function (error) {
            if (error) return response.status(500).send("Unable to update winning details of the match.");
            response.status(200).send("Match Winnings Updated.");
        })
    });
});

// Pot APIs

// 16. List of all the pots
router.get('/pots', function (request, response) {
    Pot.find({}, function (error, pots) {
        if (error) {
            return response.status(500).send("Unable to fetch pots.");
        }
        response.status(200).send(JSON.stringify(pots));
    });
});

// 17. List of all the pots for a match
router.get('/pots/:matchId', function (request, response) {
    var matchId = request.params.matchId;
    if (!matchId) {
        return response.status(500).send("Please provide Match ID");
    }
    Pot.find({
        "match._id": matchId
    }, function (error, pots) {
        if (error) {
            return response.status(500).send("Unable to fetch pots.");
        }
        response.status(200).send(JSON.stringify(pots));
    });
});

// 18. List of all the pots open for betting
router.get('/open-pots', function (request, response) {
    var time = new Date();
    Pot.find({
        "openTime": {
            $lt: time
        },
        "closeTime": {
            $gt: time
        }
    }, function (error, pots) {
        if (error) {
            return response.status(500).send("Unable to fetch pots.");
        }
        response.status(200).send(JSON.stringify(pots));
    });
});

// 19. Add new pot
router.post('/add-pot', function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data) {
        return response.status(500).send("Please provide appropriate data");
    }
    Match.findById(data.matchId, function (error, match) {
        if (error) {
            return response.status(500).send("Unable to fetch the match.");
        }
        Pot.create({
            name: data.name,
            openTime: data.openTime,
            closeTime: data.closeTime,
            match: match,
            multiplier: data.multiplier
        }, function (error) {
            if (error) {
                return response.status(500).send("Unable to create new pot.");
            }
            response.status(200).send("New Pot Created.");
        });
    });
});

// Bet APIs

// 20. View all bets
router.get('/bets', function (request, response) {
    Bet.find({}, function (error, bets) {
        if (error) {
            return response.status(500).send("Unable to fetch bets.");
        }
        response.status(200).send(JSON.stringify(bets));
    });
});

// 21. View all bets for a pot
router.get('/bets/pot/:potId', function (request, response) {
    var potId = request.params.potId;
    if (!potId) {
        return response.status(500).send("Please provide Pot ID");
    }
    Bet.find({
        "pot._id": potId
    }, function (error, bets) {
        if (error) {
            return response.status(500).send("Unable to fetch bets.");
        }
        response.status(200).send(JSON.stringify(bets));
    });
});

// 22. View all bets for a user
router.get('/bets/user/:userId', function (request, response) {
    var userId = request.params.userId;
    if (!userId) {
        return response.status(500).send("Please provide User ID");
    }
    Bet.find({
        "user.id": userId
    }, function (error, bets) {
        if (error) {
            return response.status(500).send("Unable to fetch bets.");
        }
        response.status(200).send(JSON.stringify(bets));
    });
});

// 23. Place a new bet
router.post('/place-bet', function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data) {
        return response.status(500).send("Please provide appropriate data");
    }
    Pot.findById(data.potId, function (error, pot) {
        if (error) {
            return response.status(500).send("Unable to fetch the pot.");
        }
        Bet.create({
            pot: pot,
            user: request.user,
            betOn: data.betOn,
            betTime: new Date(),
            betAmount: data.betAmount
        }, function (error, bet) {
            if (error) {
                return response.status(500).send("Unable to place the bet.");
            }
            var transactionId = 1;
            Transaction.findOne({
                $query: {},
                $orderby: {
                    id: -1
                }
            }, function (error, transaction) {
                if (error) {
                    return response.status(500).send("Unable to fetch transaction record/.");
                }
            });
            Transaction.create({

            }, function (error, transaction) {

            });
            response.status(200).send("Bet placed successfully.");
        });
    });
});
module.exports = router;
