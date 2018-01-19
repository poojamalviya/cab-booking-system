var express = require('express'),
	app = express(),
	staff = require('./controller/staff'),
	user = require('./controller/user'),
	route = require('./controller/route'),
	bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use('/', user);
app.use('/', staff);
app.use('/', route);


//--------------------------------------------node-server------------------------------------

app.listen(3000, function (err) {
	if (err) {
		error.sendError("server", res, err)
	};
	console.log('Example app listening on port 3000!')
})