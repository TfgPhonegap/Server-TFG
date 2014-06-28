
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var passwordHash = require('password-hash');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var fsExtra = require('fs-extra');
var fs = require('fs');

// Esquemes de les diferents coleccions de la bd
var User = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , password		: {type: String, required: true}
  , grup 			: {type: String, required: true}
  , grup 			: {type: String}
  , description     : { type: String, required: true, trim: true }
  , ubicacions		: {type : Array , "default" : []}
  , accessos		: {type : Array , "default" : []}	
});
var Admin = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , password		: {type: String, required: true}	
});
var Grup = new Schema({
    nom 			: {type: String, required: true, trim: true , unique: true}
  , integrants		: {type : Array , "default" : []}
  , novetats		: {type : Array , "default" : []}
});
var Porta = new Schema({
    id 				: {type: String, required: true, trim: true , unique: true}
  , grupsAdmesos	: {type : Array , "default" : []}
});


var User = mongoose.model('User', User, 'users');
var Grup = mongoose.model('Grup', Grup, 'grups');
var Porta = mongoose.model('Porta', Porta, 'portes');
var Admin = mongoose.model('Admin', Admin, 'admin');

exports.list = function(req, res){
	var user = req.headers.username;
	var grup = '';
	var bons = [];
	var dolents = [];
	var usuaris = [];
	var resultat = [];
	User.find(function(err, doc){
		usuaris = doc;

		for (var i=0; i<usuaris.length; i++) {
			if (user == usuaris[i].name) {
				grup = usuaris[i].grup;
				break;
			}
		}
		for (var i=0; i<usuaris.length; i++) {
			if (grup == usuaris[i].grup && user != usuaris[i].name)
				resultat.push(usuaris[i]);
		}
		res.send(resultat);

	});  
};

exports.userDetails = function(req, res){
	var user = req.params.userName;
	if (user == '***')
		user = req.headers.username;
	User.findOne({name: user}, function(err, doc){
		if (doc == null) {
			res.send(req.params.userName + " no és cap user");
		}
		res.send(doc);
	});
  
};

exports.newUser = function(req, res){
	var name = req.param("name");
	var descripcio = req.param("description");
	var grup = req.param("grup");
	console.log('Grup del nou user' + grup);
	var newPass =  passwordHash.generate('1234');
	console.log('hash --> ' + newPass);
	var user_data = {
		name: name,
		description: descripcio,
		grup: grup,
		avatar: 'img/avatars/nou.png',
		ubicacions: [],
		accessos: [],
		password: newPass
	};
	var newUser = new User(user_data);
	newUser.save( function(error, data){
	    if(error){
	        res.json(error);
	    }
	    else{
	    	Grup.findOne({nom: newUser.grup}, function(err, doc){
		  		if (err) 
		  			console.log(err);
		  		else {
		  			doc.integrants.unshift(newUser.name);
		  			var query = {nom: newUser.grup};
					var update = {integrants: doc.integrants};
					var options = {new: true};
					Grup.findOneAndUpdate(query, update, options, function(err, user) {
						if (err)
							console.log(err);
					});
		  		}

		  	});
	        res.send('ok');
	    }
	});
};
exports.delete = function(req, res){

	var grup ='';
	User.findOne({name: req.params.userName}, function(err, doc){
		if (doc == null) {
			res.send(req.params.userName + " no és cap user");
		}
			var grup = doc.grup;
				Grup.findOne({nom: grup}, function(err, grup){
				  		if (err) 
				  			console.log(err);
				  		else {
				  			for (var i=0; i<grup.integrants.length; i++) {
				  				if (grup.integrants[i] == doc.name) {
				  					grup.integrants.splice (i, 1);
				  				}
				  			}
				  			var query = {nom: grup.nom};
							var update = {integrants: grup.integrants};
							var options = {new: true};
							Grup.findOneAndUpdate(query, update, options, function(err, user) {
								if (err)
									console.log(err);
							});
				  		}

				  	});
	}).remove(function(err) {
		if(!err) {

			console.log('Sha eliminat ' + req.param("userName"));
			res.send('Sha eliminat ' + req.param("userName"));
		}
		else {
			console.log(err);
		}
	});  
};

exports.modificaEstat = function(req, res){
	var user = req.headers.username;
	var nouEstat = req.param('text');
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
			  			var query = {name: doc.name};
						var update = {description: nouEstat};
						var options = {new: true};
						User.findOneAndUpdate(query, update, options, function(err, user) {
							if (err)
								console.log(err);
							else
								res.send({resolucio: 'Estat modificat correctament.'});
						});
						

					
				}
			}
		
		});
 
};  

exports.modificaAvatar = function(req, res){
	var username = req.headers.username;
	var tmpPath = req.files.file.path;
	var fileName = req.files.file.name;
	var newLocation = '/home/calldidoctor/tfg/serverAplicacio/data/avatars/' + username;
	console.log(tmpPath+fileName + newLocation);

	fs.chownSync(tmpPath, 1000, 1000);
	fs.exists(newLocation, function (exists) {
		if (exists) {
			//fs.unlinkSync(newLocation + 'Prova');
			fs.unlink(newLocation, function (err) {
			  	if (err) throw err;
			  	var is = fs.createReadStream(tmpPath);
				var os = fs.createWriteStream(newLocation);
				is.pipe(os);
				is.on('end',function() {
				    fs.unlinkSync(tmpPath);
				});
			});
			
		}
		else{
			var is = fs.createReadStream(tmpPath);
			var os = fs.createWriteStream(newLocation);
			is.pipe(os);
			is.on('end',function() {
			    fs.unlinkSync(tmpPath);
			});
		}
	}); 
};  