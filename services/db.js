var mongo = require('mongodb').MongoClient,
	error = require('./error'),
	_ = require('lodash'),
	url = 'mongodb://localhost:27017/cabAllocation';


var db = module.exports = {
	insertOne: insertOne,
	insertMany: insertMany,
	findAll: findAll,
	findOne: findOne
};


function dbConnection() {
	return new Promise(function (resolve, reject) {
		mongo.connect(url)
			.then(function (db) {
				resolve(db);
			}).catch(function (err) {
				return reject(err);
			})
	})
}

function insertOne(modelName, data) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).insertOne(data);
		}).then(function (res) {
			resolve(res.ops);
		})
	});
};

function insertMany(modelName, data) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).insertMany(data);
		}).then(function (res) {
			resolve(res.ops);
		})
	});
};


function findAll(modelName) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).find().toArray();
		}).then(function (res) {
			resolve(res);
		})
	})
};

function findOne(modelName, params, res) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return b.collection(modelName).findOne(params);
		}).then(function (res) {
			resolve(res);
		})
	});
};

