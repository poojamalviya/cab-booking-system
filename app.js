var express = require('express'),
	Promise = require('bluebird'),
	app = express(),
	_ = require('lodash'),
	// error = require('./error'),
	staff = require('./controller/staff'),
    user  = require('./controller/user')
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

//console.log(user, "original");
//console.log(useraa, "checkkkk");

// app.use('/', user.test );
app.use('/', user);
app.use('/', staff);

//------------------------------user APIs-----------------------------------
// app.get('/', function(req, res) {
// 	res.send("helloooo")
// })

// app.post('/user/add', function (req, res, next) {
// 	if (!req.body || !req.body.firstName || !req.body.lastName || !req.body.gender) {
// 		error.sendError("badRequest", res, "firstName, lastName and gender is required")
// 	};
// 	var data = req.body;
// 	data["_id"] = req.body.firstName;
// 	console.log(req.body);
// 	return db.insertOne('user', data, res);
// });

// app.get('/user/show/all', function (req, res) {
// 	return db.findAll('user', res);
// });

// app.get('/user/show/:firstName', function (req, res) {
// 	if (!req.params || _.isEmpty(req.params)) {
// 		error.sendError("badRequest", res, "provide name to search")
// 	}
// 	return db.findOne('user', req.params, res);
// });

//--------------------------------------------node-server------------------------------------

app.listen(3000, function (err) {
	if (err) {
		error.sendError("server", res, err)
	};
	console.log('Example app listening on port 3000!')
})