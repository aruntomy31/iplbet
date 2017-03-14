/*jslint node:true*/
'use strict';

var router = require('express').Router();

router.get('/', function(request, response) {
    // Render Team Page with Players & Statistics
    response.status(200).send("Team Page with Player Details & Team Statistics");
});

module.exports = router;