/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();
var User = require('../db/User');

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

router.get('/', function (request, response) {
    response.render('pages/index');
});

router.get('/users', ensureAuthenticated, function (req, res, next) {
    User.find({
        id: req.user.id
    }, function (err, item) {
        if (err) {
            res.redirect('/login');
        }
        res.send(item);
    });
});

router.get('/login', function (req, res, next) {
    res.status(500).send('Failed');
});



module.exports = router;
