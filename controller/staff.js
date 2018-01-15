var express = require('express'),
	Promise = require('bluebird'),
	_ = require('lodash'),
	error = require('../services/error'),
	db = require('../services/db'),
	bodyParser = require('body-parser'),
	id = require('shortid')
router = express.Router();

router.post('/cabs', function (req, res) {
	return new Promise(function (resolve, reject) {
		if (!req.body) {
			return reject(error.sendError("badRequest", res, "drop points not found"));
		}
		//var data = req.body;
		var cabArr = [];
		_.each(req.body.cabs, function (res) {
			cabArr.push(res);
		})

		db.insertMany('Cabs', cabArr, res).then(function (err, data) {
			if (err) {
				return reject(error.sendError("dbError", res, "error in db!"));
			}
			return resolve(data);
		});
	}).catch(function (err) {
		return reject(err);
	})
});

router.post('/drop_points', function (req, res) {
	return new Promise(function (resolve, reject) {
		if (!req.body) {
			return reject(error.sendError("badRequest", res, "drop points not found"));
		}
		var data = req.body;
		data["_id"] = id();
		db.insertOne('DropPoint', data, res).then(function (data) {
			return resolve(res.send(201, data));
		}).catch(function (err) {
			return reject(err);
		})
	});
});

router.get('/route_plan', function (req, res) {
	return new Promise(function (resolve, reject) {
		console.log(req.body, "000000")
		res.send("plzzjjjjjjjjjzzzz");
	})
});

module.exports = router;
