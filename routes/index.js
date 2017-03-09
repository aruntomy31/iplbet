/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
    response.render('pages/index');
});

router.get('/users', function (req, res, next) {
    res.send(JSON.stringify(req.user));
});

module.exports = router;
