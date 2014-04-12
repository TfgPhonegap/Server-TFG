var routes = require("./handlers");
var user = require("./handlers/user");
//var namespace = require('express-namespace');

module.exports = function(app) {
	app.get('/', routes.index);
	app.namespace('/users', function(){
		app.get('/', user.list);
		app.get('/:userName', user.userDetails);
		app.post('/new', user.newUser);

	});

	

};