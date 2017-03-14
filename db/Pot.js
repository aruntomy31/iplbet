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
    openTime: Date,
    closeTime: Date,
    multiplier: Number,
    winner: String,
    match: {
        type : Object,
        ref  : 'Match'
    }
});

module.exports = mongoose.model('Pot', pot);