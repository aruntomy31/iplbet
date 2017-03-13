/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var battingStatistics = new Schema({
    notOuts    : Number,
    runsScored : Number,
    strikeRate : Number,
    highScore  : Number,
    hundreds   : Number,
    fifties    : Number,
    fours      : Number,
    sixes      : Number
});

module.exports = mongoose.model('BattingStatistics', battingStatistics);