
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