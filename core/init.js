/*jslint node:true*/

var util = require('./util');
var connection = require('./mysql').connection;

var teams = require('../core/team');
var fixtures = require('../core/fixtures');

var _userTable = "CREATE TABLE IF NOT EXISTS `user` ( `id` VARCHAR(100) PRIMARY KEY, `name` VARCHAR(200), `email` VARCHAR(100), `photoURL` VARCHAR(1000), `admin` TINYINT DEFAULT 0, `suspended` TINYINT DEFAULT 1, `activateCode` VARCHAR(100), `balance` INTEGER DEFAULT 0 ) ENGINE=InnoDB;";

var _teamTable = "CREATE TABLE IF NOT EXISTS `team` ( `id` VARCHAR(5) PRIMARY KEY, `name` VARCHAR(100), `positionLastYear` INTEGER(1), `titles` INTEGER(2) DEFAULT 0) ENGINE=InnoDB;";

var _playerTable = "CREATE TABLE IF NOT EXISTS `player` ( `id` INTEGER(3) PRIMARY KEY AUTO_INCREMENT, `name` VARCHAR(100), `team` VARCHAR(5) REFERENCES `team`(`id`)) ENGINE=InnoDB;";

var _matchTable = "CREATE TABLE IF NOT EXISTS `match` ( `id` INTEGER(3) PRIMARY KEY AUTO_INCREMENT, `homeTeam` VARCHAR(5) REFERENCES `team`(`id`), `awayTeam` VARCHAR(5) REFERENCES `team`(`id`), `fixture` DATETIME, `winner` VARCHAR(5) REFERENCES `team`(`id`), `wonBy` VARCHAR(15) ) ENGINE=InnoDB;";

var _potTable = "CREATE TABLE IF NOT EXISTS `pot` ( `id` INTEGER(4) PRIMARY KEY AUTO_INCREMENT, `displayName` VARCHAR(200) NOT NULL, `openTime` DATETIME, `closeTime` DATETIME, `isTeamLevel` TINYINT DEFAULT 0, `multiplierHome` INTEGER(3) DEFAULT 1, `multiplierAway` INTEGER(3) DEFAULT 1, `winner` VARCHAR(100), `match` INTEGER(3) REFERENCES `match`(`id`) ) ENGINE=InnoDB;";

var _betTable = "CREATE TABLE IF NOT EXISTS `bet` ( `id` INTEGER(10) PRIMARY KEY AUTO_INCREMENT, `pot` INTEGER(4) REFERENCES `pot`(`id`), `user` VARCHAR(100) REFERENCES `user`(`id`), `betOn` VARCHAR(100) NOT NULL, `betTeam` VARCHAR(100) NOT NULL, `betTime` DATETIME DEFAULT CURRENT_TIMESTAMP, `betAmount` INTEGER NOT NULL, `multiplier` INTEGER(3) DEFAULT 1, `winAmount` INTEGER ) ENGINE=InnoDB;";

var _transactionTable = "CREATE TABLE IF NOT EXISTS `transaction` ( `id` INTEGER(10) PRIMARY KEY AUTO_INCREMENT, `from` VARCHAR(100), `to` VARCHAR(100), `type` VARCHAR(10), `time` DATETIME DEFAULT CURRENT_TIMESTAMP, `amount` INTEGER, `balanceFrom` INTEGER, `balanceTo` INTEGER ) ENGINE=InnoDB;";

function _createTables() {
    var tables = [ _userTable, _teamTable, _playerTable, _matchTable, _potTable, _betTable, _transactionTable ];
    for(var table of tables) {
        connection.query(table, function(error, result) {
            if(error) return console.log("Create Table Failed: " + error);
        });
    }
};

function _initializeData() {
    
    var _teamQuery = "INSERT INTO `team` VALUES ?";
    var _playerQuery = "INSERT INTO `player` (`name`, `team`) VALUES ?";
    
    connection.beginTransaction(function(error) {
        if(error) return console.log("Unable to start a transaction: " + error);
        
        connection.query("SELECT `id` FROM `team`", function(error, results) {
            if(error) return console.log("Unable to fetch list of teams");
            if(results.length !== 0) return console.log("Already Initialized");
            var _teamQueryValues = [];
            var _playerQueryValues = [];

            for(var key in teams) {
                _teamQueryValues.push([ key, teams[key].name, teams[key].positionLastYear, teams[key].titles ]);
                for(var player of teams[key].players) {
                    _playerQueryValues.push([ player, key ]);
                }
            }

            var _fixtureQuery = "INSERT INTO `match` (`homeTeam`, `awayTeam`, `fixture`) VALUES ?"
            var _fixtureQueryValues = [];

            fixtures.forEach(fixture => {
                _fixtureQueryValues.push([ fixture.home, fixture.away, util.getIPLDate(fixture.fixture) ]);
            });

            connection.query(_teamQuery, [_teamQueryValues], function(error, results) {
                if(error) {
                    return connection.rollback(function() {
                        console.log("Error while inserting teams: " + error);
                    });
                }

                connection.query(_playerQuery, [_playerQueryValues], function(error, results) {
                    if(error) {
                        return connection.rollback(function() {
                            console.log("Error while inserting players: " + error);
                        });
                    }

                    connection.query(_fixtureQuery, [_fixtureQueryValues], function(error, results) {
                        if(error) {
                            return connection.rollback(function() {
                                console.log("Error while inserting fixtures: " + error);
                            });
                        }

                        connection.commit(function(error) {
                            if(error) {
                                return connection.rollback(function() {
                                    console.log("Error while committing: " + error);
                                });
                            }
                        });
                    });
                });
            });
        });
    });
}

// Drop All Tables Query: drop table bet; drop table player; drop table `match`; drop table pot; drop table team; drop table transaction; drop table user;

module.exports = function() {
    _createTables();
    _initializeData();
};