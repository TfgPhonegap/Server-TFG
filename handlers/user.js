
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
mongoose.connect('mongodb://localhost/tfg');

var User = new Schema({
    id      		: String
  , name 			: {type: String, required: true, trim: true , unique: true}
  , description     : { type: String, required: true, trim: true }
  , avatar        	: { type: String, required: true, trim: true }
});

var User = mongoose.model('User', User, 'users');

/*var userSchema = {
	id: String,
	name: String,
	description: String,
	avatar: String
};

var User = mongoose.model('User', userSchema, 'users');*/

exports.list = function(req, res){
	User.find(function(err, doc){
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
