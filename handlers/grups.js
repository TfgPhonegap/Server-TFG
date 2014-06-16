
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
			grups.push({name: doc[i].nom});
		}
		console.log(grups);
		res.send(grups);
	});
};