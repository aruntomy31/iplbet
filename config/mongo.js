/*jslint node:true*/
'use strict';

module.exports = {
    uri  : (process.env.MONGODB_URI ? process.env.MONGODB_URI : 'mongodb://localhost:27017/iplbet'),
    root : __dirname + "/../backup",
    tar  : 'dump.tar'
};