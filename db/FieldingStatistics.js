/*jslint node:true*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fieldingStatistics = Schema({
    catches    : Number,
    stumpings  : Number,
    runOuts    : Number
});

module.exports = mongoose.model('FieldingStatistics', fieldingStatistics);