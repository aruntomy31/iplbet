/*jslint node:true*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    email: String,
    photoURL: String,
    admin: Boolean
});
module.exports = mongoose.model('User', userSchema);
