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

/**
 * connection to mongodb
 */
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

/**
 * function insertOne ==>> insert one object
 * @param {string} modelName ==>> collection name  where data needs to be inserted
 * @param {object} data ==>> object to be inserted
 * return promise for inserted data
 */
function insertOne(modelName, data) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).insertOne(data);
		}).then(function (res) {
			resolve(res.ops);
		})
	});
};

/**
 * function insertMany ==>> insert objects in single call in array
 * @param {string} modelName ==>> collection name  where data needs to be inserted
 * @param {array} data ==>> array of objects to be inserted
 * return promise for inserted data
 */
function insertMany(modelName, data) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).insertMany(data);
		}).then(function (res) {
			resolve(res.ops);
		})
	});
};

/**
 * function findAll ==>> get the data of particular collection
 * @param {string} modelName ==>> collection name from where user need data
 * return promise of data in array
 */
function findAll(modelName) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).find().toArray();
		}).then(function (res) {
			resolve(res);
		})
	})
};

/**
 * function findOne ==>> get one particular object from db
 * @param {string} modelName ==>> collection name from where user need data
 * @param {string} params ==>> search parameter to get particular data
 * return promise of data in object
 */
function findOne(modelName, params) {
	return new Promise(function (resolve, reject) {
		dbConnection().then(function (db) {
			return db.collection(modelName).findOne(params);
		}).then(function (res) {
			resolve(res);
		})
	});
};

