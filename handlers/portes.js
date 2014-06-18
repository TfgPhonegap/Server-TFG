
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


exports.vistaPorta = function(req, res){
	var idPorta = req.params.idPorta;
	//res.render('clauQR', { idPorta: idPorta });
	res.sendfile('portes.html');
  
};

exports.getClau = function(req, res){
	//De moment retornarem el mateix per totes les portes, però realment s'haurà de mirar qui fa la petició
	// (token), i enviar una contrassenya específica per ella.
	// També cladrà comprovar que la porta existeixi realment.
	// Que l'Id porta no sigui per paràmetre, sino pel token de login.
	var idPorta = 'Porta 2';
	console.log('id Porta --> ' + idPorta);
	//res.render('clauQR', { idPorta: idPorta });
	//Aquesta OTP s'ha de crear cada vegada que algú ve a aquesta ruta. (Random, hash, etc...)
	var OTP = 'XXXX';
	//util.porta.setClau(idPorta, OTP);
	console.log('Enviant clau --> ' + OTP);
	res.send({porta: idPorta, clau: OTP});
};

exports.llista = function(req, res){
	Porta.find(function(err, doc){
		res.send(doc);
	});
};

exports.delete = function(req, res){
	Porta.findOne({id: req.params.porta}, function(err, doc){
		if (doc.grupsAdmesos.length > 0)
			res.send('error');
		else {
			Porta.findOne({id: doc.id}, function(err, doc){

			}).remove(function(err) {
				if(!err) {
					console.log("S'ha eliminat la porta correctament");
					res.send(200);
				}
				else {
					console.log(err);
				}
				});  
		}
	});
};

exports.revocarAcces = function(req, res){
	var porta = req.params.porta;
	var grup = req.params.grup;
	Porta.findOne({id: porta}, function(err, doc){
		for (var i=0; i<doc.grupsAdmesos.length; i++) {
			if (doc.grupsAdmesos[i] == grup) {
				doc.grupsAdmesos.splice(i,1);
	  			var query = {id: doc.id};
				var update = {grupsAdmesos: doc.grupsAdmesos};
				var options = {new: true};
				Porta.findOneAndUpdate(query, update, options, function(err, user) {
					if (err)
						console.log(err);
				});
			}
		}
	});
};

exports.novaPorta = function(req, res){
	var id = req.param("id");
	console.log(id);
	var porta_data = {
		id: id,
		grupsAdmesos: []
	};
	var novaPorta = new Porta(porta_data);
	novaPorta.save( function(error, data){
	    if(error){
	        res.json(error);
	    }
	    else{
	        res.send('ok');
	    }
	});
};
exports.nouAccesGrup = function(req, res){
	var porta = req.param("porta");
	var nousGrups = req.param("nousGrups");
	Porta.findOne({id: porta}, function(err, doc){
		for (var i=0; i<nousGrups.length; i++) {
			var calAfegir = true;
			for (var j=0; j<doc.grupsAdmesos.length; j++) {
				if (nousGrups[i] == doc.grupsAdmesos[j])
					calAfegir = false;
			}
			if (calAfegir) {
				doc.grupsAdmesos.unshift(nousGrups[i]);
	  			var query = {id: doc.id};
				var update = {grupsAdmesos: doc.grupsAdmesos};
				var options = {new: true};
				Porta.findOneAndUpdate(query, update, options, function(err, user) {
					if (err)
						console.log(err);
					res.send('ok');
				});
			}
		}
	});
};
