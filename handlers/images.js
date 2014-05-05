
/*
 * GET users listing.
 */


exports.perfil = function(req, res){
	res.sendfile('data/avatars/' + req.params.userName);
  
};

exports.novaUbicacio = function(req, res){
	//Arreclar això, s'estan fen 2 accessos a BD quan crec que es podria fer amb un.
	var nouLloc = req.param("lloc");
	var nouComentari = req.param("comentari");
	var novaData = req.param("data");
	var usuari = req.params.userName;

	User.findOne({name: usuari}, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				res.send(req.params.userName + " no és cap user");
			}
			else {
				var query = {name: usuari};
				// Afegim la nova ubicació a l'inici de la llista
				doc.ubicacions.unshift({comentari: nouComentari,
			                  lloc: nouLloc,
			                  data: novaData});

				var update = {ubicacions: doc.ubicacions};
				var options = {new: true};
				User.findOneAndUpdate(query, update, options, function(err, user) {
				  if (err) {
				    console.log('got an error');
				    console.log(err);
				    res.send(false);
				  }
				  else {
				  	console.log('No hi ha hagut error :)))))');
				  	console.log(user);
				  	resultat = user;
				  	res.send(true);
				  }
				});
			}
		}
		
	});




  
};
  

