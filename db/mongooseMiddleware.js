/*jslint node:true*/
'use strict';

var mongoose = require('mongoose');

module.exports = function (uri) {
    if (typeof uri !== 'string') {
        throw new TypeError('Expected uri to be a string');
    }

    var property = 'db',
        connection;

    return function mongooseMiddleware(req, res, next) {
        if (!connection) {
            connection = mongoose.connect(uri);
        }

        connection
            .then(function (db) {
                req[property] = db;
                next();
            })
            .catch(function (err) {
                connection = undefined;
                next(err);
            });
    };
};
