/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var player = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    photo: String,
    team: {
        type : Object,
        ref  : 'Team'
    },
    matches : Number,
    battingStats: {
        type : Object,
        ref  : 'BattingStatistics'
    },
    bowlingStats: {
        type : Object,
        ref  : 'BowlingStatistics'
    },
    fieldingStats: {
        type : Object,
        ref  : 'FieldingStatistics'
    }
});

module.exports = mongoose.model('Player', player);