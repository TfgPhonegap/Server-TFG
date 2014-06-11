
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


exports.clauQR = function(req, res){
	var idPorta = req.params.idPorta;
	var socket = io.connect();
	socket.emit('PortesJS');
	//res.render('clauQR', { idPorta: idPorta });
	 res.sendfile('./views/prova.html');
  
};