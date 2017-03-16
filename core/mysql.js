/*jslint node:true*/
'use strict';

var mysql = require('mysql');

module.exports.config = {
    host : "iplbet.cxsqpqjzmj8y.us-west-2.rds.amazonaws.com",
    port : 3306,
    user : "iplbet",
    password : "Toor1234",
    database : "iplbet",
    expiration : 60 * 60 * 1000,
    createDatabaseTable : true,
    schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

module.exports.connection = mysql.createConnection({
    host : this.config.host,
    port : this.config.port,
    user : this.config.user,
    password : this.config.password,
    database : this.config.database
});