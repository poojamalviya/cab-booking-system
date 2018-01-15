var mongo = require('mongodb').MongoClient,
	error = require('./error'),
	_ = require('lodash'),
	url = 'mongodb://localhost:27017/cabTarget';


var db = module.exports = {
	insertOne: insertOne,
	insertMany: insertMany,
	findAll: findAll,
	findOne: findOne
};

function insertOne(modelName, data, res) {
	return new Promise(function (resolve, reject) {
		mongo.connect(url, function (err, db) {
			if (err) {
				return reject(error.sendError("dbConnection", res, err));
			}
			db.collection(modelName).insertOne(data, function (result) {

				return resolve(res.send(data));
			})
		})
	});
};

function insertMany(modelName, data, res) {
	return new Promise(function (resolve, reject) {
		mongo.connect(url, function (err, db) {
			if (err) {
				return reject(error.sendError("dbConnection", res, err));
			}
			db.collection(modelName).insertMany(data, function (err, result) {
				if (err){
					return reject(err);
				}
				return resolve(data);
			})
		})
	});
};


function findAll(modelName, res) {
	return new Promise(function (resolve, reject) {
		mongo.connect(url, function (err, db) {
			if (err) {
				return reject(error.sendError("dbConnection", res, err));
			}
			db.collection(modelName).find().toArray(function (err, result) {
				if (err) {
					return reject(error.sendError("dbError", res, err));
				}
				return resolve(res.send(result));
			})
		}).catch(function (err) {
			return reject(err);
		})
	});
};


function findOne(modelName, params, res) {
	return new Promise(function (resolve, reject) {
		mongo.connect(url, function (err, db) {
			if (err) {
				return reject(error.sendError("dbConnection", res, err));
			}
			db.collection(modelName).findOne(params, function (err, result) {
				if (err) {
					return reject(error.sendError("dbError", res, err));
				}
				return resolve(res.send(result));
			})
		}).catch(function (err) {
			return reject(err);
		})
	});
};

