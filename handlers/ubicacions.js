
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;



var User = mongoose.model('User', User, 'users');
var Grup = mongoose.model('Grup', Grup, 'grups');


exports.llistaUser = function(req, res){
	var usuari = {name: req.params.userName};
	if (req.params.userName == '***')
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
	var usuari = req.headers.username;
	console.log('User capcelera -_Z> ' + usuari);
	if (typeof usuari === "undefined") 
		res.send(401);

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
						dataTrobada=true;
						break;
					}
				}
				// Testejar això perquè pot ser que falli.(He unit el codi repetit que hi havia.)
				var query = {name: usuari};
				var update = {ubicacions: doc.ubicacions};
				var options = {new: true};
				if (dataTrobada) {
					doc.ubicacions[i].ubicacionsDia.unshift({comentari: nouComentari,
			                  lloc: nouLloc,
			                  hora: novaHora});
				}
				else {
					doc.ubicacions.unshift({data: novaData, ubicacionsDia: [{comentari: nouComentari,
			                  lloc: nouLloc,
			                  hora: novaHora}]});
				}
				User.findOneAndUpdate(query, update, options, function(err, user) {
				  if (err) {
				    console.log('got an error');
				    console.log(err);
				    res.send(false);
				  }
				  else {
				  	console.log('No hi ha hagut error :)))))');

				  	console.log('Nom user--> ' + user.name + user.grup);
				  	Grup.findOne({nom: user.grup}, function(err, doc){
				  		if (err) 
				  			console.log(err);
				  		else {
				  			doc.novetats.unshift({tipus: 'ubicacio', userName: user.name, lloc: nouLloc});
				  			var query = {nom: user.grup};
							var update = {novetats: doc.novetats};
							var options = {new: true};
							Grup.findOneAndUpdate(query, update, options, function(err, user) {
								if (err)
									console.log(err);
								else {
									console.log('Novetats actualitzades correctament');
									console.log(doc.novetats);
								}
							});
				  		}

				  	});
				  	resultat = user;
				  	res.send(doc.ubicacions);
				  }
				});
			}
		}
		
	});




  
};
  

