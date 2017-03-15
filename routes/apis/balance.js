/*jslint node:true*/
'use strict';

var util = require('../../util');
var router = require('express').Router();

// Schemas

var User = require('../../db/User');

// 1. Update Balance [By Specific Amount] of All Users [/apis/balance/update/all]
router.post('/update/all', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.amount) {
        return response.status(500).send("Provide Amount");
    }
    
    // Validate Data... and implement RollBack
    
    if (data.amount <= 0) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    
    User.find({ suspended: false }, function (error, users) {
        if (error || !users) {
            return response.status(500).send("Unable to fetch users.");
        }
        var lastUser = users[users.length - 1];
        for (var user of users) {
            user.balance = user.balance + data.amount;
            user.save(function (error, user) {
                if (error) {
                    return response.status(500).send("Update Balance Failed.");
                }
            });
        }
        return response.status(200).send("Balance Updated for All Users.");
    });
});

// 2. Update Balance of One User [Only by Admin] [/apis/balance/update/user/:user]
router.post('/update/user/:user', util.checkAdmin, function(request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.amount) {
        return response.status(500).send("Provide Amount");
    }
    
    // Validate Data... and implement RollBack
    
    if (data.amount <= 0) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    
    User.findOne({ suspended: false }, function (error, user) {
        if (error || !user) {
            return response.status(500).send("Unable to fetch users.");
        }
        user.balance = user.balance + data.amount;
        user.save(function (error, user) {
            if (error) {
                return response.status(500).send("Update Balance Failed.");
            }
            response.status(200).send("Balance Updated for the user.");
        });
    });
});

// 3. Transfer Funds [/apis/balance/transfer]
router.post('/transfer', util.checkActiveUser, function(request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data) {
        return response.status(500).send("Please provide appropriate data");
    }
    
    // Validate Data... and implement RollBack
    
    User.find({ $or: [
        { id: data.to.id },
        { id: request.user.id }
    ] }, function(error, users) {
        if(error) return response.status(500).send("Unable to fetch user");
        if(users.length !== 2) return response.status(500).send("Invalid Transfer");
        var fromUser, toUser;
        if(users[0].id === request.user.id) {
            fromUser = users[0];
            toUser = users[1];
        } else {
            fromUser = users[1];
            toUser = users[0];
        }
        fromUser.balance -= data.amount;
        toUser.balance += data.amount;
        
        fromUser.save(function(error) {
            if(error) {
                return response.status(500).send("Unable to transfer");
            }
            toUser.save(function(error) {
                if(error) {
                    return response.status(500).send("Unable to transfer");
                }
            });
        });
        
    });
    
});

module.exports = router;