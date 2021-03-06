
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var util = require("../util/util");



var User = mongoose.model('User', User, 'users');
var Porta = mongoose.model('Porta', Porta, 'portes');
var Grup = mongoose.model('Grup', Grup, 'grups');


exports.llista = function(req, res){
	var usuari = {name: req.params.userName};
	if (req.params.userName == '***')
		usuari = {name: util.tokenizer.getPayload(req.headers.authorization).username};
	User.findOne(usuari, function(err, doc){
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
	var usuari = util.tokenizer.getPayload(req.headers.authorization).username;
	var grup = util.tokenizer.getPayload(req.headers.authorization).grup;
	var nouLloc = req.param("idPorta");
	var novaData = req.param("data");
	var novaHora = req.param("hora");
	var idPorta = {id: req.param("idPorta")};
	var userAdmes = false;
	var clauRebuda = new String(req.param("clau"));
	//Busquem clau a la memoria del server
	var clauMemoria = new String(util.porta.getClauPorta(nouLloc));
	if (clauRebuda.localeCompare(clauMemoria) == 0){
		Porta.findOne(idPorta, function(err, doc){
			if (err) {
				res.send(err);
			}
			else {
				if (doc == null) {
					console.log('null');
					res.send({resolucioAcces: 'Aquesta porta no existeix'});
				}
				else {
					console.log('document no està buit ' + doc);
					for (var i=0; i<doc.grupsAdmesos.length; i++) {
						if (grup == doc.grupsAdmesos[i])
							userAdmes = true;
					}
					//Busquem l'user per afegir l'accés, tan si és el denegat com l'admés.
					User.findOne({name: usuari}, function(err, userTrobat){
						if (!err && userTrobat != null) {
							var dataTrobada=false;
							var i=0;
							for (i; i<userTrobat.accessos.length; i++) {
								if (novaData == userTrobat.accessos[i].data) {
									dataTrobada=true;
									break;
								}
							}
							var query = {name: usuari};
							var update = {accessos: userTrobat.accessos};
							var options = {new: true};
							if (dataTrobada) {
								userTrobat.accessos[i].accessosDia.unshift({resultat: userAdmes,
						                  lloc: nouLloc,
						                  hora: novaHora});
							}
							else {
								userTrobat.accessos.unshift({data: novaData, accessosDia: [{resultat: userAdmes,
						                  lloc: nouLloc,
						                  hora: novaHora}]});
							}
							User.findOneAndUpdate(query, update, options, function(err, userFinal) {
								if (!err) {
									Grup.findOne({nom: userFinal.grup}, function(err, grup){
										grup.novetats.unshift({tipus: 'acces', userName: userFinal.name, 
											lloc: nouLloc});
							  			var query = {nom: userFinal.grup};
										var update = {novetats: grup.novetats};
										var options = {new: true};
										
										Grup.findOneAndUpdate(query, update, options, function(err, grup2) {
										});
								  	});
								}
							});
						}
					});
					if (userAdmes) {
						res.send({resolucioAcces: 'Pots passar.'});
					}
					else {
						res.send({resolucioAcces: 'Accés denegat!'});
					}

				}
			}
			
		});
	}
	else {
		res.send({resolucioAcces: '¡Clau no vàlida!'});
	}




  
};
  

