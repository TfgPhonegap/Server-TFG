
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var passwordHash = require('password-hash');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var util = require("../util/util");


var User = mongoose.model('User', User, 'users');
var Admin = mongoose.model('Admin', Admin, 'admin');



exports.login = function(req, res){
	var user = req.param('user');
	User.findOne({name: user.username}, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				console.log('no trobat');
				res.send(req.params.userName + " no és cap user");
			}
			else {
				if (passwordHash.verify(user.password, doc.password)) {
					console.log('Login Acceptat');
					res.send({authorizationToken: util.tokenizer.generateToken({username: user.username
						, grup: doc.grup}),
						 username: user.username});
				}
				else {
					console.log('envian un 401 de tornada');
					res.send(401);
				}

			}
		}
		
	});
  
};
exports.loginAdmin = function(req, res){
	var pass = req.param('pass');
	Admin.findOne({name: 'admin'}, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				console.log('no trobat');
				res.send(req.params.userName + " no és cap user");
			}
			else {
					console.log('Enviada '+ pass);
					console.log('BD '+doc.password);
				if (pass == doc.password) {
					console.log('Login Acceptat');
					res.send({authorizationToken: util.tokenizer.generateToken({admin: true})});
				}
				else {
					console.log('envian un 401 de tornada');
					res.send(401);
				}

			}
		}
		
	});
  
};


exports.updatePass = function(req, res){
	var user = req.headers.username;
	var antiga = req.param('old');
	var nova1 = req.param('new1');
	var nova2 = req.param('new2');

	if (nova1 == nova2) {
		User.findOne({name: user}, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				console.log('no trobat');
				res.send(req.params.userName + " no és cap user");
			}
			else {
				if (passwordHash.verify(antiga, doc.password)) {
		  			var query = {name: doc.name};
					var update = {password: passwordHash.generate(nova1)};
					var options = {new: true};
					User.findOneAndUpdate(query, update, options, function(err, user) {
						if (err)
							console.log(err);
						else
							res.send({resolucio: 'Contrasenya modificada correctament.'});
					});
					
				}
				else
					res.send({resolucio: 'Contrasenya antiga incorrecte!'});
				
			}
		}
		
	});

	}
	else
		res.send({resolucio: 'Les noves claus no concorden'});
 
};  