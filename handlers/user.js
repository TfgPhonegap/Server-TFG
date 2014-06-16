
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;

// Esquemes de les diferents coleccions de la bd
var User = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , password		: {type: String, required: true}
  , grup 			: {type: String, required: true}
  , description     : { type: String, required: true, trim: true }
  , ubicacions		: {type : Array , "default" : []}
  , accessos		: {type : Array , "default" : []}	
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

exports.list = function(req, res){
	var user = req.headers.username;
	var grup = '';
	var bons = [];
	var dolents = [];
	var usuaris = [];
	var resultat = [];
	User.find(function(err, doc){
		usuaris = doc;
/*		for (var i=0; i<usuaris.length; i++) {
			if (user == usuaris[i].name)
				grup = usuaris[i].grup;
			else {
				if (usuaris[i].grup=='bons') {
					bons.push(usuaris[i]);
				}
				else {
					dolents.push(usuaris[i]);
				}
			}
		}	
		// Mirar de fer-ho dinàmic. Si es crea un grup nou que passa?
		if (grup == 'bons') {
			res.send(bons);
		}
		else {
			res.send(dolents);
		}*/


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

	console.log("user="+req.param("name"));
	console.log("Descripcio="+req.param("description"));
	console.log(req.param("grup"));
	var user_data = {
		name: req.param("name"),
		description: req.param("description"),
		grup: req.param("grup"),
		avatar: 'no foto',
		ubicacions: [],
		accessos: [],
		password: '1234'
	};
	var newUser = new User(user_data);
	newUser.save( function(error, data){
	    if(error){
	        res.json(error);
	    }
	    else{
	        res.send('ok');
	    }
	});
};
exports.delete = function(req, res){


	User.findOne({name: req.params.userName}, function(err, doc){
		if (doc == null) {
			res.send(req.params.userName + " no és cap user");
		}
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
