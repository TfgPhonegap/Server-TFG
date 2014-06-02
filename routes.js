var routes = require("./handlers");
var user = require("./handlers/user");
var ubicacions = require("./handlers/ubicacions");
var images = require("./handlers/images");
var accessos = require("./handlers/accessos");
var seguretat = require("./handlers/seguretat");
var portes = require("./handlers/portes");
var novetats = require("./handlers/novetats");
var util = require("./util/util");
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID

//var namespace = require('express-namespace');

// Funció que servirà per preguntar si l'usuari està logejat o no
// Comprovar si ve token, si no ve tornar 401.
// Fer-ho a totes les rutes menys la del login.


// No es el que vull fer pero crec k shaura de fer...
var User = mongoose.model('User', User, 'users');

// Mirar perquè si externelitzo el findOne ho fa després de retornar un 401.
// Jo ho vull posar tot al Util!
var auth = function(req, res, next){
	var user = null;
	if (typeof req.headers.authorization != "undefined") {
		user = util.tokenizer.getPayload(req.headers.authorization).username;
		User.findOne({name: user}, function(err, doc){
			if (doc == null) {
				console.log('hauria de retornar false');
				res.send(401);
			}
			console.log('NEXT');
			next();
		});
	}
	else
		res.send(401);
	

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
		app.post('/nova/', ubicacions.novaUbicacio);
	});
	app.namespace('/accessos', function(){
		app.get('/:userName', auth, accessos.llista);
		app.post('/nou', auth, accessos.nouAcces);
	});
	app.namespace('/images', function(){
		app.get('/avatar/:userName', images.perfil);
		app.get('/ubicacio/:lloc', images.ubicacio);
	});
	app.namespace('/clau', function(){
		app.get('/:idPorta', portes.clauQR);
	});

	app.get('/novetats', auth, novetats.llista);
	// Login/Logout Routes
	app.post('/login', seguretat.login);
	

	

};