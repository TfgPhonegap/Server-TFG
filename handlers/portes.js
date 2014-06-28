
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var util = require("../util/util");
var io = require('socket.io');
var hash = require('password-hash');



var User = mongoose.model('User', User, 'users');
var Porta = mongoose.model('Porta', Porta, 'portes');
var Grup = mongoose.model('Grup', Grup, 'grups');


exports.vistaPorta = function(req, res){
	var idPorta = req.params.idPorta;
	res.sendfile('portes.html');
  
};

exports.getClau = function(req, res){
	var idPorta = req.params.idPorta;
	console.log('id Porta --> ' + idPorta);
	var data = new Date();
	var moment = data.toString();
	// Es crea la pass d'un sol ús.
	var OTP = hash.generate(moment);
	util.porta.setClau(idPorta, OTP);
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
