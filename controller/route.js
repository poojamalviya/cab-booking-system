var express = require('express'),
Promise = require('bluebird'),
_ = require('lodash'),
error = require('../services/error'),
db = require('../services/db'),
bodyParser = require('body-parser'),
id = require('shortid'),
router = express.Router();

router.get('/route_plan', function (req, res) {
	return new Promise(function (resolve, reject) {
	return resolve	(res.send(data));
	})
});

module.exports = router;
