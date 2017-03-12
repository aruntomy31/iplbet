/*jslint node:true*/
'use strict';
var express = require('express');
var router = express.Router();
var User = require('../db/User');

function ensureAuthenticated(req, res, next) {
    if (req.session.passport.user.id) {
        req.user = req.session.passport.user;
        return next();
    }
    res.redirect('/login');
}

router.get('/', function (request, response) {
    response.render('pages/index', {
        title: 'BettingBad : Home',
        active: 'home'
    });
});

router.get('/rules', function (request, response) {
    response.render('pages/rules', {
        title: 'BettingBad : Rules',
        active: 'rules'
    });
});

router.get('/fixtures', function (request, response) {
    response.render('pages/fixtures', {
        title: 'BettingBad : Fixtures',
        active: 'fixtures'
    });
});

router.get('/prizes', function (request, response) {
    response.render('pages/prizes', {
        title: 'BettingBad : Prizes',
        active: 'prizes'
    });
});

router.get('/stats', function (request, response) {
    response.render('pages/stats', {
        title: 'BettingBad : Statistics',
        active: 'stats'
    });
});

router.get('/users', ensureAuthenticated, function (req, res, next) {
    User.find({
        id: req.user.id
    }, function (err, item) {
        if (err) {
            res.redirect('/login');
        }
        res.render('pages/users/index', {
            user: {
                name: 'Lallu Anthoor'
            },
            active: 'home'
        });
    });
});

router.get('/userdummy', function(req, res, next){
    res.render('pages/users/index', {
        title: 'BettingBad : User Home',
        user: {
            name: 'Lallu Anthoor',
            moneyInHand: 200000,
            moneyInBet: 100000,
            moneyWon: 223492,
            moneyLost: 234234
        },
        active: 'home'
    })
})

router.get('/login', function (req, res, next) {
    res.status(500).send('Failed');
});



module.exports = router;