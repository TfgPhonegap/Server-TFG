
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;



var User = mongoose.model('User', User, 'users');



exports.llistaUser = function(req, res){
	var usuari = {name: req.params.userName};
	if (req.params.userName == '***')
		usuari = {name: req.headers.username};
	console.log('usari que anem a buscar ubicacions--> ' + usuari.name);
	User.findOne(usuari, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				res.send(req.params.userName + " no és cap user");
			}
			else {
				res.send(doc.ubicacions);
			}
		}
		
	});
  
};

exports.novaUbicacio = function(req, res){
	//Arreclar això, s'estan fen 2 accessos a BD quan crec que es podria fer amb un.
	var nouLloc = req.param("lloc");
	var nouComentari = req.param("comentari");
	var novaData = req.param("data");
	var novaHora = req.param("hora");
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
				//Busquem si ja existeix alguna ubicació amb aquella data:
				var dataTrobada=false;
				var i=0;
				for (i; i<doc.ubicacions.length; i++) {
					if (novaData == doc.ubicacions[i].data) {
						console.log('Aquesta data ' + doc.ubicacions[i].data + ' és la que buscava' );
						dataTrobada=true;
						break;
					}
				}
				
				var query = {name: usuari};
				var update = {ubicacions: doc.ubicacions};
				var options = {new: true};
				if (dataTrobada) {
					doc.ubicacions[i].ubicacionsDia.unshift({comentari: nouComentari,
			                  lloc: nouLloc,
			                  hora: novaHora});
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
					  	res.send(doc.ubicacions);
					  }
					});
				}
				else {
					doc.ubicacions.unshift({data: novaData, ubicacionsDia: [{comentari: nouComentari,
			                  lloc: nouLloc,
			                  hora: novaHora}]});					
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
					  	res.send(doc.ubicacions);
					  }
					});
				}


				/*var query = {name: usuari};
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
				});*/
			}
		}
		
	});




  
};
  

