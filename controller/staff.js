var express = require('express'),
	Promise = require('bluebird'),
	_ = require('lodash'),
	error = require('../services/error'),
	db = require('../services/db'),
	bodyParser = require('body-parser'),
	id = require('shortid'),
	router = express.Router();

router.post('/cabs', function (req, res) {
	return new Promise(function (resolve, reject) {
		if (!req.body) {
			return reject(error.sendError("badRequest", res, "drop points not found"));
		}
		var cabArr = [];
		_.each(req.body.cabs, function (res) {
			res["_id"] = res.id;
			cabArr.push(res);
		})
		db.insertMany('Cabs', cabArr).then(function (data) {
			return resolve(res.status(201).send(data));
		}).catch(function (err) {
			return reject(err);
		});
	});
});

router.post('/drop_points', function (req, res) {
	return new Promise(function (resolve, reject) {
		if (!req.body) {
			return reject(error.sendError("badRequest", res, "drop points not found"));
		}
		var data = req.body;
		data["_id"] = id();
		db.insertOne('DropPoint', data).then(function (data) {
			return resolve(res.status(201).send(data));
		}).catch(function (err) {
			return reject(err);
		})
	});
});

module.exports = router;
