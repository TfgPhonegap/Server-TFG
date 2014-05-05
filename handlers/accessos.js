
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;



var User = mongoose.model('User', User, 'users');



exports.llista = function(req, res){
	User.findOne({name: req.params.userName}, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				res.send(req.params.userName + " no és cap user");
			}
			else {
				res.send(doc.accessos);
			}
		}
		
	});
  
};

exports.nouAcces = function(req, res){
	//Implementar nou acces
	




  
};
  

