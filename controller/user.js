var express = require('express'),
	Promise = require('bluebird'),
	app = express(),
	_ = require('lodash'),
	error = require('../services/error'),
	db = require('../services/db');

router = express.Router(),
	bodyParser = require('body-parser');

router.post('/register', function (req, res) {
	return new Promise(function (resolve, reject) {
		if (!req.body || !req.body.team_member_id || req.body.gender || req.body.drop_point) {
			return reject(error.sendError("badRequest", res, "user information is required"));
		}
		db.findAll("DropPoint").then(function (drops) {
			var data = req.body;
			if (data.drop_point in drops[0]) {
				data["_id"] = data.team_member_id;
				return db.insertOne('User', data);
			}
			else {
				return reject(error.sendError("badRequest", res, "please provide the correct drop point"));
			}
		}).then(function (data) {
			return resolve(res.status(201).send(data));
		}).catch(function (err) {
			return reject(err);
		})
	});
});

module.exports = router;

