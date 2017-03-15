/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var match = new Schema({
    name: String,
    homeTeam: {
        type : Object,
        ref  : 'Team'
    },
    awayTeam: {
        type : Object,
        ref  : 'Team'
    },
    fixture: Date,
    winner: String,
    wonBy: String
});

module.exports = mongoose.model('Match', match);