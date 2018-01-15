var express = require('express'),
	Promise = require('bluebird'),
	app = express(),
	_ = require('lodash'),
	//error = require('./services/error'),
	db = require('../services/db');
    
	router = express.Router(),
	bodyParser = require('body-parser');

router.post('/register', function (req, res) {

	res.send("");
});
// function test(req, res) {
// 	console.log(req.body)

module.exports = router;

