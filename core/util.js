/*jslint node:true*/
'use strict';

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports.checkUser = function (request, response, next) {
    if (request.isAuthenticated()) {
        if (request.user.admin) response.redirect('/admin');
        else return next();
    } else {
        response.redirect('/');
    }
};

module.exports.checkActiveUser = function (request, response, next) {
    if (request.isAuthenticated()) {
        if (!request.user.suspended) return next();
        else response.redirect('/error');
    } else {
        response.redirect('/');
    }
};

module.exports.checkAdmin = function (request, response, next) {
    if (request.isAuthenticated()) {
        if (request.user.admin) return next();
        else response.redirect('/users');
    } else {
        response.redirect('/');
    }
};

module.exports.checkInteger = function(integer, message) {
    try {
        return parseInt(integer, 10);
    } catch(error) {
        console.log("Check Integer Failed: " + error);
        console.log("Error Stack Trace" + error.stack);
        throw message;
    }
}

module.exports.getReadableFixture = function (date) {
    var fixture = {};
    var dd = date.getDate();
    dd = dd < 10 ? "0" + dd : dd;
    fixture.date = dd + "-" + months[date.getMonth()] + "-" + date.getFullYear();
    fixture.time = date.toLocaleTimeString();
    return fixture;
};

module.exports.getIPLDate = function (string) {
    var parts = string.toString().split(",");
    var dateParts = parts[0].split("/");
    var dateDD = dateParts[0] < 10 ? "0" + dateParts[0] : dateParts[0];
    var timeHour = parts[1] == 4 ? "16" : "20";
    return "2017-0" + dateParts[1] + "-" + dateDD + " " + timeHour + ":00:00";
};

module.exports.getSQLDate = function (date) {
    var dd = date.getDate();
    dd = dd < 10 ? "0" + dd : dd;
    var mm = date.getMonth() + 1;
    mm = mm < 10 ? "0" + mm : mm;
    return date.getFullYear() + "-" + mm + "-" + dd + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};

module.exports.subtractDate = function (date, difference) {
    return new Date(date.getTime() - difference);
};