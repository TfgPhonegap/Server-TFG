var routes = require("./handlers");
var user = require("./handlers/user");
var ubicacions = require("./handlers/ubicacions");
var images = require("./handlers/images");
var accessos = require("./handlers/accessos");

//var namespace = require('express-namespace');

module.exports = function(app) {
	app.get('/', routes.index);
	app.namespace('/users', function(){
		app.get('/', user.list);
		app.get('/:userName', user.userDetails);
		app.post('/new', user.newUser);
		app.delete('/delete/:userName', user.delete);
	});
	app.namespace('/ubicacions', function(){
		app.get('/:userName', ubicacions.llistaUser);
		app.post('/nova/:userName', ubicacions.novaUbicacio);
	});
	app.namespace('/accessos', function(){
		app.get('/:userName', accessos.llista);
		//app.post('/nova/:userName', ubicacions.novaUbicacio);
	});
	app.namespace('/images', function(){
		app.get('/:userName', images.perfil);
	});

	

};