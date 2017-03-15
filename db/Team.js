/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var Object = mongoose.Schema.Types.Object;

var team = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    logo: String,
    currentPosition: Number,
    positionLastYear: Number,
    titles: Number,
    players: [{
        type : Object,
        ref  : 'Player'
    }]
});

module.exports = mongoose.model('Team', team);