
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



exports.llistaUsers = function(req, res){
	var resultat = [];
	User.find(function(err, doc){
		usuaris = doc;

		for (var i=0; i<usuaris.length; i++) {
			resultat.push(usuaris[i]);
		}
		res.send(resultat);

	});  
};