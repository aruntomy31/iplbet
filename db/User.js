/*jslint node:true*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name : String,
    email : String,
    photoURL : String,
    admin : Boolean,
    suspended : Boolean,
    activateCode : String,
    balance : Number
});

module.exports = mongoose.model('User', user);