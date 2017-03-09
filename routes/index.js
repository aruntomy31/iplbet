/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();

router.get('/', function (request, response) {
    response.render('pages/index');
});

router.get('/users', function (req, res, next) {
    res.send(req.body);
});

router.get('/login', function (req, res, next) {
    res.status(500).send('Failed');
});

module.exports = router;
