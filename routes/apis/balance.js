/*jslint node:true*/
'use strict';

var util = require('../../core/util');
var connection = require('../../core/mysql').connection;
var router = require('express').Router();

// 1. Update Balance [By Specific Amount] of All Users [/apis/balance/update/all]
router.post('/update/all', util.checkAdmin, function (request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    if (!data || !data.amount) {
        return response.status(500).send("Provide Amount");
    }
    
    if (data.amount <= 0) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    
    connection.beginTransaction(function(error) {
        if(error) return response.status(500).send("Unable to begin transaction");
        
        connection.query("UPDATE `user` SET `balance`=`balance` + ? WHERE `suspended` = 0", data.amount, function(error, results) {
            if(error) {
                connection.rollback(function() { console.log("Unable to update user balance: " + error); });
                return response.status(500).send("Unable to update user balance.");
            }
            
            connection.query("SELECT `id`, `balance` FROM `user` WHERE `suspended` = 0", function(error, results) {
                if(error) {
                    connection.rollback(function() { console.log("Unable to fetch users: " + error); });
                    return response.status(500).send("Unable to fetch users.");
                }
                
                var _query = "INSERT INTO `transaction` (`from`, `to`, `type`, `amount`, `balanceFrom`, `balanceTo`) VALUES ?";
                var _queryValues = [];
                results.forEach(user => {
                    _queryValues.push([ 'IPL', user.id, 'BONUS', data.amount, 0, user.balance ]);
                });
                
                connection.query(_query, [_queryValues], function(error, results) {
                    if(error) {
                        connection.rollback(function() { console.log("Unable to insert transactions: " + error); });
                        return response.status(500).send("Unable to insert transactions");
                    }
                    
                    connection.commit(function(error) {
                        if(error) {
                            connection.rollback(function() { console.log("Unable to commit transaction: " + error); });
                            return response.status(500).send("Unable to commit transaction");
                        }
                        
                        return response.status(200).send("BONUS [" + data.amount + "] given to all active users.");
                    });
                });
                
            });
        });
        
    });
    
});

// 2. Update Balance of One User [Only by Admin] [/apis/balance/update/user/:user]
router.post('/update/user/:user', util.checkAdmin, function(request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    data.user = request.params.user;
    if (!data || !data.amount || !data.user) {
        return response.status(500).send("Provide UserId and Amount");
    }
    
    if (data.amount <= 0) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    
    connection.beginTransaction(function(error) {
        if(error) return response.status(500).send("Unable to begin transaction");
        
        connection.query("UPDATE `user` SET `balance`=`balance` + ? WHERE `suspended` = 0 AND `id` = ?", [ data.amount, data.user ], function(error, results) {
            if(error) {
                connection.rollback(function() { console.log("Unable to update user balance: " + error); });
                return response.status(500).send("Unable to update user balance.");
            }
            
            connection.query("SELECT `id`, `name`, `balance` FROM `user` WHERE `suspended` = 0 AND `id` = ?", data.user, function(error, results) {
                if(error) {
                    connection.rollback(function() { console.log("Unable to fetch user: " + error); });
                    return response.status(500).send("Unable to fetch user.");
                }
                
                var _query = "INSERT INTO `transaction` (`from`, `to`, `type`, `amount`, `balanceFrom`, `balanceTo`) VALUES ?";
                var _queryValues = [];
                results.forEach(user => {
                    _queryValues.push([ 'IPL', user.id, 'BONUS', data.amount, 0, user.balance ]);
                });
                
                connection.query(_query, [_queryValues], function(error, results) {
                    if(error) {
                        connection.rollback(function() { console.log("Unable to insert transaction: " + error); });
                        return response.status(500).send("Unable to insert transaction.");
                    }
                    
                    connection.commit(function(error) {
                        if(error) {
                            connection.rollback(function() { console.log("Unable to commit transaction: " + error); });
                            return response.status(500).send("Unable to commit transaction.");
                        }
                        
                        return response.status(200).send("BONUS [" + data.amount + "] given to user [" + results[0].name + "].");
                    });
                });
            });
        });
    });
});

// 3. Transfer Funds [/apis/balance/transfer]
router.post('/transfer/:to', util.checkActiveUser, function(request, response) {
    var data = request.body ? JSON.parse(request.body) : undefined;
    data.to = request.params.to;
    
    if (!data || !data.to || !data.amount || !Number.isInteger(data.amount)) {
        return response.status(500).send("Please provide appropriate data");
    }
    
    if( data.amount <= 0 ) {
        return response.status(500).send("Please enter a valid non-zero amount.");
    }
    
    connection.beginTransaction(function(error) {
        if(error) return response.status(500).send("Unable to begin transaction");
        
        connection.query("SELECT `id`, `name`, `balance` FROM `user` WHERE `id` = ?", request.user.id, function(error, results) {
            if(error) {
                connection.rollback(function() { console.log("Unable to fetch user: " + error); });
                return response.status(500).send("Unable to fetch user.");
            }
            
            var fromUser = results[0];
            
            if(fromUser.balance < data.amount) {
                connection.rollback(function() {});
                return response.status(500).send("User balance is less than transfer amount.");
            }
            
            connection.query("UPDATE `user` SET `balance` = `balance` - ? WHERE `id` = ?", [ data.amount, request.user.id ], function(error, results) {
                if(error) {
                    connection.rollback(function() { console.log("Unable to update user: " + error); });
                    return response.status(500).send("Unable to update user.");
                }
                
                connection.query("UPDATE `user` SET `balance` = `balance` + ? WHERE `suspended` = 0 AND `id` = ?", [ data.amount, data.to ], function(error, results) {
                    if(error) {
                        connection.rollback(function() { console.log("Unable to update user: " + error); });
                        return response.status(500).send("Unable to update user.");
                    }

                    connection.query("SELECT `id`, `name`, `balance` FROM `user` WHERE `suspended` = 0 AND `id` = ?", data.to, function(error, results) {
                        if(error) {
                            connection.rollback(function() { console.log("Unable to fetch user: " + error); });
                            return response.status(500).send("Unable to fetch user.");
                        }

                        if(results.length !== 1) {
                            connection.rollback(function() {});
                            return response.status(500).send("Invalid user for transfer.");
                        }

                        var toUser = results[0];

                        connection.query("INSERT INTO `transaction` (`from`, `to`, `type`, `amount`, `balanceFrom`, `balanceTo`) VALUES (?, ?, ?, ?, ?)",
                                        [ fromUser.id, toUser.id, 'TRANSFER', data.amount, fromUser.balance-data.amount, toUser.balance ], function(error, results) {
                            if(error) {
                                connection.rollback(function() { console.log("Unable to insert transaction: " + error); });
                                return response.status(500).send("Unable to insert transaction.");
                            }
                            
                            connection.commit(function(error) {
                                if(error) {
                                    connection.rollback(function() { console.log("Unable to commit transaction: " + error); });
                                    return response.status(500).send("Unable to commit transaction.");
                                }

                                return response.status(200).send("TRANSFER [" + data.amount + "] from user [" + fromUser.name + "] to user [" + toUser.name + "].");
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;