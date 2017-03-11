/*jslint node:true*/

var mongoose = require('mongoose');

var battingStatistics = new mongoose.Schema({
    notOuts    : Number,
    runsScored : Number,
    strikeRate : Number,
    highScore  : Number,
    hundreds   : Number,
    fiftys     : Number,
    fours      : Number,
    sixs       : Number
});

module.exports = mongoose.model('BattingStatistics', battingStatistics);