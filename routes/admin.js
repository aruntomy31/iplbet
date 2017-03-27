/*jslint node:true*/
'use strict';

var util = require('../core/util');
var router = require('express').Router();

router.get('/', function (request, response) {
    try {
        response.render('pages/admin/index', {
            title: 'BettingBad : Admin Home',
            active: 'home',
            user: {
                name: request.user.name
            }
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

router.get('/users', function (request, response) {
    try {
        response.render('pages/admin/user', {
            title: 'BettingBad : User Management',
            active: 'users',
            user: {
                name: request.user.name
            }
        });
    } catch(error) {
        console.log("Error Stack Trace: " + error.stack);
        response.redirect('/error');
    }
});

router.get('/pots', function (request, response) {
	try {
		response.render('pages/admin/pots', {
			title: 'BettingBad : Pot Management',
			active: 'pots',
			user: {
				name: request.user.name
			}
		});
	} catch(error) {
        console.log("Error Stack Trace: " + error.stack);
		response.redirect('/error');
	}
});

router.get('/results', function (request, response) {
	try {
		response.render('pages/admin/result', {
			title: 'BettingBad : Publish Result',
			active: 'results',
			user: {
				name: request.user.name
			}
		});
	} catch(error) {
        console.log("Error Stack Trace: " + error.stack);
		response.redirect('/error');
	}
});

module.exports = router;