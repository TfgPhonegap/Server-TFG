
/*
 * GET users listing.
 */

 var fs = require('fs');


exports.perfil = function(req, res){
	console.log(req.params.userName);
	fs.exists('data/avatars/' + req.params.userName, function (exists) {
		if (exists) {
			res.sendfile('data/avatars/' + req.params.userName);
		}
		else{
			res.sendfile('data/avatars/nou.png');
		}
	});
	
  
};

exports.ubicacio = function(req, res){
	res.sendfile('data/ubicacions/' + req.params.lloc);
  
};
exports.acces = function(req, res){
	res.sendfile('data/accessos/' + req.params.id);
  
};


  

