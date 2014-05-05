
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;

var User = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , description     : { type: String, required: true, trim: true }
  , ubicacions		: {type : Array , "default" : []}
  , accessos		: {type : Array , "default" : []}	
});

var User = mongoose.model('User', User, 'users');

exports.list = function(req, res){
	User.find(function(err, doc){
		console.log('Enviem lo seguent');
		console.log(doc);
		res.send(doc);
	});
  
};

exports.userDetails = function(req, res){
	User.findOne({name: req.params.userName}, function(err, doc){
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
