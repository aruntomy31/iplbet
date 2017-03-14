/*jslint node:true*/
'use strict';

var User = require('./db/User');

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports.ensureAuthenticated = function (request, response, next) {
    // Check if request contains session user variable
    if (request.isAuthenticated() === true) {
        // -> Check if user exists in DB
        User.find({
            id: request.user.id
        }, function (error, user) {
            if (error || user.length === 0) {
                console.log(error);
                response.redirect('/login');
            } else {
                // User Exists
                user = user[0];
                if (user.admin === true && request.baseUrl === '/users') response.redirect('/admin');
                else if (user.admin === false && request.baseUrl === '/admin') response.redirect('/users');
                else return next();
            }
        });
    } else response.redirect('/login');
};

module.exports.checkAdmin = function (request, response, next) {
    User.find({
        id: request.user.id,
        admin: true
    }, function (error, user) {
        if (error || user.length === 0) {
            response.redirect('/login');
        } else return next();
    });
};

module.exports.getReadableFixture = function (date) {
    var fixture = {};
    date = new Date(date);
    var dd = date.getDate();
    dd = dd < 10 ? "0" + dd : dd;
    var mm = date.getMonth();
    mm = mm < 10 ? "0" + mm : mm;
    fixture.date = dd + "-" + mm + "-" + date.getFullYear();
    fixture.time = date.toLocaleTimeString();
    return fixture;
}

module.exports.getIPLDate = function (string) {
    var parts = string.split(",");
    var dateParts = parts[0].split("/");
    var dateDD = dateParts[0] < 10 ? "0" + dateParts[0] : dateParts[0];
    var timeHour = parts[1] == 4 ? "16" : "20";
    return new Date("2017-0" + dateParts[1] + "-" + dateDD + "T" + timeHour + ":00:00+05:30");
}
