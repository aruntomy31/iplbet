/*jslint node:true*/

var mongoose = require('mongoose');

var player = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    team: {
        type : mongoose.Schema.Type.ObjectId,
        ref  : 'Team'
    },
    matches : Number,
    battingStats: {
        type : mongoose.Schema.Type.ObjectId,
        ref  : 'BattingStatistics'
    },
    bowlingStats: {
        type : mongoose.Schema.Type.ObjectId,
        ref  : 'BowlingStatistics'
    }
});

module.exports = mongoose.model('Player', player);