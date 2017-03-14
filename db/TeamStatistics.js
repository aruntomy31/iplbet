/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var teamStatistics = Schema({
    matches : Number,
    won     : Number,
    lost    : Number,
    tie     : Number,
    nr      : Number,
    netRR   : Number,
    points  : Number
});

module.exports = mongoose.model('TeamStatistics', teamStatistics);