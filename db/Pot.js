/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var pot = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    openTime: Date,
    closeTime: Date,
    isTeamLevel: Boolean,
    multiplierHome: {
        type: Number,
        default: 1
    },
    multiplierAway: {
        type: Number,
        default: 1
    },
    winner: String,
    match: {
        type : Object,
        ref  : 'Match'
    }
});

module.exports = mongoose.model('Pot', pot);