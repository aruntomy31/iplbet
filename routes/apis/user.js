/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. List of All Users [/apis/user/all]
router.get('/all', util.checkAdmin, function (request, response) {
    connection.query("SELECT * FROM `user`", function(error, users) {
        if(error) return response.status(500).send(error);
        return response.status(200).send(JSON.stringify(users));
    });
});

// 2. List of Active Users [/apis/user/active]
router.get('/active', util.checkAdmin, function (request, response) {
    connection.query("SELECT * FROM `user` WHERE `suspended` = 0", function(error, users) {
        if(error) return response.status(500).send(error);
        return response.status(200).send(JSON.stringify(users));
    });
});

// 3. Activate User with Activation Code [Directly from mail] [/apis/user/activate/:user/:code]
router.get('/activate/:user/:code', function (request, response) {
    var userId = request.params.user ? request.params.user : '';
    var code = request.params.code ? request.params.code : '';
    
    connection.query("UPDATE `user` SET `suspended` = 0 WHERE `id` = ? AND `activateCode` = ?", [ userId, code ], function(error, result) {
        if(error) return response.status(500).send("Activation Failed. Invalid User.");
        else return response.status(200).send("User Activated");
    });
});

// 4. Activate User via Admin Login [/apis/user/activate]
router.post('/activate', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    
    // Validate Data... and implement RollBack
    
    connection.query("UPDATE `user` SET `suspended` = 0 WHERE `id` = ?", data.userId, function(error, result) {
        if(error) return response.status(500).send("Activation Failed. Invalid User.");
        else return response.status(200).send("User Activated");
    });
});

// 5. Deactivate User via Admin Login [/apis/user/deactivate]
router.post('/deactivate', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    
    // Validate Data... and implement RollBack
    
    connection.query("UPDATE `user` SET `suspended` = 1 WHERE `id` = ?", data.userId, function(error, result) {
        if(error) return response.status(500).send("Dectivation Failed. Invalid User.");
        else return response.status(200).send("User Deactivated");
    });
});

// 6. User Balance Over period of 'x' days
router.get('/balance/:days', util.checkUser, function(request, response) {
    var days = request.params.days;
    if(!Number.isInteger()) return response.status(500).send("Invalid Number of Days");
    
    var date = new Date();
    var startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()-days, 5, 30, 0);
    var endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 4, 29, 59);
    var oneDayInMs = 1 * 24 * 60 * 60 * 1000;
    
    connection.query("SELECT * FROM `transaction` WHERE (`from` = ? OR `to` = ?) AND `time` >= ? AND `time` <= ? ORDER BY `time` DESC",
                    [ request.user.id, request.user.id, util.getIPLDate(startTime), util.getIPLDate(endTime) ], function(error, transactions) {
        if(error) return response.status(500).send("Unable to fetch transactions");
        
        var result = {
            x: [],
            y: []
        };
        
        var x = endTime.getTime();
        transactions.forEach(transaction => {
            if(x >= transaction.time.getTime()) {
                var readableDate = util.getReadableFixture(new Date(x)).date;
                result.x.push(readableDate.slice(0, readableDate.lastIndexOf('-')));
                if(transaction.from && transaction.from.id === request.user.id) {
                    result.y.push(transaction.balanceFrom);
                } else {
                    result.y.push(transaction.balanceTo);
                }
                x -= oneDayInMs;
            }
        });
        
        response.status(200).send(JSON.stringify(result));
    });
});

module.exports = router;