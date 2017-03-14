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
    winner: String,
    betTime: Date,
    betAmount: Number
});

module.exports = mongoose.model('Bet', bet);