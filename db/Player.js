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
    matches : Number
});

module.exports = mongoose.model('Player', player);