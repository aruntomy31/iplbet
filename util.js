/*jslint node:true*/
'use strict';

var User = require('./db/User');

var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

module.exports.checkUser = function(request, response, next) {
    if(request.isAuthenticated()) {
        User.findOne({ id: request.user.id }, function(error, user) {
            if(error) response.redirect('/login');
            else if(user.admin === true) response.redirect('/admin');
            else return next();
        });
    } else {
        response.redirect('/login');
    }
};

module.exports.checkActiveUser = function(request, response, next) {
    if(request.isAuthenticated()) {
        User.findOne({ id: request.user.id, admin: false, suspended: false }, function(error, user) {
            if(error) response.redirect('/login');
            else return next();
        });
    } else {
        response.redirect('/login');
    }
};

module.exports.checkAdmin = function(request, response, next) {
    if(request.isAuthenticated()) {
        User.findOne({ id: request.user.id }, function(error, user) {
            if(error) response.redirect('/login');
            else if(user.admin === true) return next();
            else response.redirect('/users');
        });
    } else {
        response.redirect('/login');
    }
};

module.exports.getReadableFixture = function(date) {
    var fixture = {};
    var dd = date.getDate();
    dd = dd < 10 ? "0" + dd : dd;
    fixture.date = dd + "-" + months[date.getMonth()] + "-" + date.getFullYear();
    var time = new Date(date.getTime() + 19800000);
    fixture.time = time.toLocaleTimeString();
    return fixture;
}

module.exports.getIPLDate = function(string) {
    var parts = string.split(",");
    var dateParts = parts[0].split("/");
    var dateDD = dateParts[0] < 10 ? "0" + dateParts[0] : dateParts[0];
    var timeHour = parts[1] == 4 ? "16" : "20";
    return new Date("2017-0" + dateParts[1] + "-" + dateDD + "T" + timeHour + ":00:00+05:30");
}