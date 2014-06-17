
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var util = require("../util/util");
var io = require('socket.io');



var User = mongoose.model('User', User, 'users');
var Porta = mongoose.model('Porta', Porta, 'portes');
var Grup = mongoose.model('Grup', Grup, 'grups');



exports.llista = function(req, res){
	var grups = [];
	Grup.find(function(err, doc){
		for (var i=0; i<doc.length; i++){
			grups.push({name: doc[i].nom, mida: doc[i].integrants.length});
		}
		console.log(grups);
		res.send(grups);
	});
};
exports.delete = function(req, res){
	Grup.findOne({nom: req.params.grup}, function(err, doc){
		if (doc.integrants.length > 0)
			res.send('error');
		else {
			Grup.findOne({nom: doc.nom}, function(err, doc){
				Porta.find(function(err, portes){
					for (var i=0; i<portes.length; i++) {
						Porta.findOne({id: portes[i].id}, function(err, porta){
						  		if (err) 
						  			console.log(err);
						  		else {
						  			for (var i=0; i<porta.grupsAdmesos.length; i++) {
						  				if (porta.grupsAdmesos[i] == doc.nom) {
						  					porta.grupsAdmesos.splice (i, 1);
						  				}
						  			}
						  			var query = {id: porta.id};
									var update = {grupsAdmesos: porta.grupsAdmesos};
									var options = {new: true};
									console.log('Apunt de fer lupdate de ' + update);
									Porta.findOneAndUpdate(query, update, options, function(err, user) {
										if (err)
											console.log(err);
									});
						  		}

						  	});
					}
				});
			}).remove(function(err) {
				if(!err) {
					console.log("S'ha eliminat el grup correctament");
					res.send(200);
				}
				else {
					console.log(err);
				}
			});  
		}
	});
	console.log('Això no es pot veure mai :(((((');
};
exports.nouGrup = function(req, res){
	var nom = req.param("nom");
	var portesAccessibles = req.param("portesAccessibles");
	var grup_data = {
		nom: nom,
		integrants: [],
		novetats: []
	};
	var nouGrup = new Grup(grup_data);
	nouGrup.save( function(error, data){
	    if(error){
	        res.json(error);
	    }
	    else{
	    	console.log(portesAccessibles);
	    	for (var i=0; i<portesAccessibles.length; i++) {
	    		Porta.findOne({id: portesAccessibles[i]}, function(err, doc){
			  		if (err) 
			  			console.log(err);
			  		else {
			  			console.log(grup_data)
			  			doc.grupsAdmesos.unshift(grup_data.nom);
			  			var query = {id: doc.id};
						var update = {grupsAdmesos: doc.grupsAdmesos};
						var options = {new: true};
						Porta.findOneAndUpdate(query, update, options, function(err, user) {
							if (err)
								console.log(err);
						});
			  		}

		  		});
	    	}
	        res.send('ok');
	    }
	});
};