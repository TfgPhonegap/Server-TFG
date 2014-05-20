
/*
 * GET novetats.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;



var User = mongoose.model('User', User, 'users');
var Grup = mongoose.model('Grup', Grup, 'grups');


exports.llista = function(req, res){
	usuari = {name: req.headers.username};
	User.findOne(usuari, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				res.send(req.params.userName + " no és cap user");
			}
			else {
				var grup = {nom: doc.grup};
				Grup.findOne(grup, function(err, doc){
					if (err) {
						console.log(err);
						res.send('Grup inexistent');
					}
					else {
						console.log(doc);
						console.log(doc.novetats);
						for (var i = 0;i<doc.novetats.length;i++)
							console.log(doc.novetats[i].tipus);
						res.send(doc.novetats);
					}

				});
			}
		}
		
	});
  
};


  

