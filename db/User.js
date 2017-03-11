/*jslint node:true*/

var mongoose = require('mongoose');

var user = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name      : String,
    email     : String,
    photoURL  : String,
    admin     : Boolean,
    suspended : Boolean
});

module.exports = mongoose.model('User', user);