/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bowlingStatistics = Schema({
    balls          : Number,
    maidens        : Number,
    runsConceded   : Number,
    wickets        : Number,
    bestFigures    : String
});

module.exports = mongoose.model('BowlingStatistics', bowlingStatistics);