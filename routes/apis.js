/*jslint node:true*/
'use strict';

var router = require('express').Router();

// User APIs
router.use('/user', require('./apis/user'));

// Team APIs
router.use('/team', require('./apis/team'));

// Player APIs
router.use('/player', require('./apis/player'));

// Match APIs
router.use('/match', require('./apis/match'));

// Pot APIs
router.use('/pot', require('./apis/pot'));

// Bet APIs
router.use('/bet', require('./apis/bet'));

// Balance APIs
router.use('/balance', require('./apis/balance'));

module.exports = router;