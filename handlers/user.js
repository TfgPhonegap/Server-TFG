
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


var User = mongoose.model('User', User, 'users');
var Grup = mongoose.model('Grup', Grup, 'grups');

exports.list = function(req, res){
	console.log(req.headers.username);
	var user = req.headers.username;
	var grup = '';
	var bons = [];
	var dolents = [];
	var usuaris = [];
	User.find(function(err, doc){
		usuaris = doc;
		for (var i=0; i<usuaris.length; i++) {
			if (user == usuaris[i].name)
				grup = usuaris[i].grup;
			else {
				if (usuaris[i].grup=='bons') {
					console.log('Ha de ser bo');
					console.log(usuaris[i].name + usuaris[i].grup);
					bons.push(usuaris[i]);
				}
				else {
					console.log('Ha de ser dolent');
					console.log(usuaris[i].name + usuaris[i].grup);
					console.log(usuaris[i]);
					dolents.push(usuaris[i]);
				}
			}
			console.log('-----------------------------');
		}	
		if (grup == 'bons') {
			console.log('retorno la llista de bons');
			res.send(bons);
		}
		else {
			console.log('retorno la llista de diolents');
			res.send(dolents);
		}
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
	console.log("pass="+req.param("description"));
	var user_data = {
		name: req.param("name"),
		description: req.param("description"),
		avatar: req.param("avatar")
	};
	var newUser = new User(user_data);
	newUser.save( function(error, data){
	    if(error){
	        res.json(error);
	    }
	    else{
	        res.json(data);
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
