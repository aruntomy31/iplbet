/*jslint node:true*/

var mongoose = require('mongoose');

var team = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    logo: String,
    positionLastYear: Number,
    titles: Number,
    players: [{
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Player'
    }]
});

module.exports = mongoose.model('Team', team);