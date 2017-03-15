/*jslint node:true*/
'use strict';

var util = require('../../util');
var router = require('express').Router();

// Schemas

var User = require('../../db/User');
var Transaction = require('../../db/Transaction');

// 1. List of All Users [/apis/user/all]
router.get('/all', util.checkAdmin, function (request, response) {
    User.find({}, function (error, users) {
        if (error) {
            return response.status(500).send(error);
        }
        return response.status(200).send(JSON.stringify(users));
    });
});

// 2. List of Active Users [/apis/user/active]
router.get('/active', util.checkAdmin, function (request, response) {
    User.find({
        suspended: false
    }, function (error, users) {
        if (error) {
            return response.status(500).send(error);
        }
        return response.status(200).send(JSON.stringify(users));
    });
});

// 3. Activate User with Activation Code [Directly from mail] [/apis/user/activate/:user/:code]
router.get('/activate/:user/:code', function (request, response) {
    var userId = request.params.user ? request.params.user : '';
    var code = request.params.code ? request.params.code : '';
    User.findOne({
        id: userId,
        activateCode: code
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Activation Failed. Invalid User.");
        }
        user.suspended = false;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Activation Failed.");
            }
            return response.status(200).send("User Activated.");
        });
    });
});

// 4. Activate User via Admin Login [/apis/user/activate]
router.post('/activate', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    
    // Validate Data... and implement RollBack
    
    User.findOne({
        id: data.userId
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Activation Failed. Invalid User.");
        }
        user.suspended = false;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Activation Failed.");
            }
            return response.status(200).send("User Activated.");
        });
    });
});

// 5. Deactivate User via Admin Login [/apis/user/deactivate]
router.post('/deactivate', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.userId) {
        return response.status(500).send("Provide UserId");
    }
    
    // Validate Data... and implement RollBack
    
    User.findOne({
        id: data.userId
    }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Deactivation Failed. Invalid User.");
        }
        user.suspended = true;
        user.save(function (error) {
            if (error) {
                return response.status(500).send("Deactivation Failed.");
            }
            return response.status(200).send("User Deactivated.");
        });
    });
});

// 6. User Balance Over period of 'x' days
router.get('/balance/:days', util.checkUser, function(request, response) {
    var days = request.params.days;
    if(!Number.isInteger()) return response.status(500).send("Invalid Number of Days");
    
    var date = new Date();
    var startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()-days, 5, 30, 00);
    var endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, 4, 29, 59);
    var oneDayInMs = 1 * 24 * 60 * 60 * 1000;
    
    Transaction.find({ $or: [
        { "from.id": request.user.id },
        { "to": request.user._id }
    ], time: { $gte: startTime, $lte: endTime }}).sort({ time: -1 }).exec(function(error, transactions) {
        if(error) {
            return response.status(500).send("Unable to fetch transactions");
        }
        
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