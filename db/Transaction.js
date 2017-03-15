/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var transaction = new Schema({
    from: {
        type : Object,
        ref  : 'User'
    },
    to: ObjectId,
    type: String,
    time: Date,
    amount: Number
});

module.exports = mongoose.model('Transaction', transaction);