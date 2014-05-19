
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;



var User = mongoose.model('User', User, 'users');



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
				if (user.password == doc.password) {
					console.log('Login Acceptat');
					// Cal tornar token (fer-ho amb JWT)
					res.send({authorizationToken: 'tokentokentokentoken', username: user.username});
				}
				else {
					console.log('envian un 401 de tornada');
					res.send(401);
				}

			}
		}
		
	});
  
};  

