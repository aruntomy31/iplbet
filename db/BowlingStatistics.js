/*jslint node:true*/

var mongoose = require('mongoose');

var bowlingStatistics = new mongoose.Schema({
    balls      : Number,
    runsGiven  : Number,
    wickets    : Number
});

module.exports = mongoose.model('BowlingStatistics', bowlingStatistics);