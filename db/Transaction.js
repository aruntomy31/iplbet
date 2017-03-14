/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var transaction = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    from: {
        type : Object,
        ref  : 'User'
    },
    to: String,
    type: String,
    time: Date,
    amount: Number
});

module.exports = mongoose.model('Transaction', transaction);