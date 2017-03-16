/*jslint node:true*/
'use strict';

var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

module.exports.checkUser = function(request, response, next) {
    if(request.isAuthenticated()) {
        if(request.user.admin === true) response.redirect('/admin');
        else return next();
    } else {
        response.redirect('/');
    }
};

module.exports.checkActiveUser = function(request, response, next) {
    if(request.isAuthenticated()) {
        if(request.user.admin === false && request.user.suspended === false) return next();
        else response.redirect('/error');
    } else {
        response.redirect('/');
    }
};

module.exports.checkAdmin = function(request, response, next) {
    if(request.isAuthenticated()) {
        if(request.user.admin === true) return next();
        else response.redirect('/users');
    } else {
        response.redirect('/');
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
    return "2017-0" + dateParts[1] + "-" + dateDD + " " + timeHour + ":00:00";
}