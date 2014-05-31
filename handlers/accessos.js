
/*
 * GET users listing.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;
var util = require("../util/util");



var User = mongoose.model('User', User, 'users');
var Porta = mongoose.model('Porta', Porta, 'portes');


exports.llista = function(req, res){
	var usuari = {name: util.tokenizer.getPayload(req.headers.authorization).username};
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
				res.send(doc.accessos);
			}
		}
		
	});
  
};

exports.nouAcces = function(req, res){
	//Considero que si existeix el token l'usuari i grup existiran. (Pensar si això és veritat o no)
	var usuari = util.tokenizer.getPayload(req.headers.authorization).username;
	var grup = util.tokenizer.getPayload(req.headers.authorization).grup;
	console.log('Nou acces handler');
	console.log(req.headers);
	console.log(usuari + grup);
	var idPorta = {id: req.param("idPorta")};
	var userAdmes = false;
	Porta.findOne(idPorta, function(err, doc){
		if (err) {
			res.send(err);
		}
		else {
			if (doc == null) {
				console.log('nullllllll');
				res.send('porta inexistent');
			}
			else {
				console.log('document no està buit ' + doc);
				for (var i=0; i<doc.grupsAdmesos.length; i++) {
					if (grup == doc.grupsAdmesos[i])
						userAdmes = true;
				}
				if (userAdmes) {
					//Afegir accès i contestar amb un acces permès.
					console.log('Lusuari està acceptat per entrar');
					res.send({resolucioAcces: 'Tens accés :)'});
				}
				else {
					console.log('Lusuari no pot entrar......');
					res.send({resolucioAcces: 'No acces dude :('});
				}

			}
		}
		
	});





  
};
  

