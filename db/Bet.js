/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var bet = new Schema({
    pot: {
        type: Object,
        ref : 'Pot',
        required: true
    },
    user: {
        type : Object,
        ref  : 'User'
    },
    betOn: String,
    betTime: Date,
    betAmount: Number,
    multiplier: Number,
    winAmount: Number
});

module.exports = mongoose.model('Bet', bet);