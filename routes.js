var routes = require("./handlers");
var user = require("./handlers/user");
var ubicacions = require("./handlers/ubicacions");
var images = require("./handlers/images");
var accessos = require("./handlers/accessos");
var seguretat = require("./handlers/seguretat");

//var namespace = require('express-namespace');

// Funció que servirà per preguntar si l'usuari està logejat o no
// Comprovar si ve token, si no ve tornar 401.
// Fer-ho a totes les rutes menys la del login.
var auth = function(req, res, next){
	console.log(req.headers);
	if (req.headers.authorization=='tokentokentokentoken') {
		next();
	}
	else {
		res.send(401);
	}

};

module.exports = function(app) {
	app.get('/', routes.index);
	app.namespace('/users', function(){
		app.get('/', auth, user.list);
		app.get('/:userName', auth, user.userDetails);
		app.post('/new', user.newUser);
		app.delete('/delete/:userName', user.delete);
	});
	app.namespace('/ubicacions', function(){
		app.get('/:userName', auth, ubicacions.llistaUser);
		app.post('/nova/:userName', ubicacions.novaUbicacio);
	});
	app.namespace('/accessos', function(){
		app.get('/:userName', auth, accessos.llista);
		//app.post('/nova/:userName', ubicacions.novaUbicacio);
	});
	app.namespace('/images', function(){
		app.get('/avatar/:userName', images.perfil);
		app.get('/ubicacio/:lloc', images.ubicacio);
	});


	// Login/Logout Routes
	app.post('/login', seguretat.login);
	

	

};