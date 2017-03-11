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
    
});

module.exports = router;