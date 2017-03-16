/*jslint node:true*/
'use strict';

var util = require('../core/util');
var router = require('express').Router();

router.get('/', function(request, response) {
    response.render('pages/admin/index', {
        title: 'BettingBad : Admin Home',
        active: 'home',
        user: {
            name: request.user.name
        }
    });
});

module.exports = router;