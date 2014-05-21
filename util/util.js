var jwt = require('jwt-simple');
var mongoose = require("mongoose");
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;

// Esquemes de les diferents coleccions de la bd
var User2 = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , password		: {type: String, required: true}
  , grup 			: {type: String, required: true}
  , description     : { type: String, required: true, trim: true }
  , ubicacions		: {type : Array , "default" : []}
  , accessos		: {type : Array , "default" : []}	
});
var Grup2 = new Schema({
    nom 			: {type: String, required: true, trim: true , unique: true}
  , integrants		: {type : Array , "default" : []}
  , novetats		: {type : Array , "default" : []}
});

var User = mongoose.model('User2', User2, 'users');
var Grup = mongoose.model('Grup2', Grup2, 'grups');

exports.tokenizer = {
    hash: "HS512",
    secret: "ELSECRETQUESHADEMIRARsiCALcanVIar543543*/5*4/354328734trhj3er829354",
    generateToken: function (payload) {
        return jwt.encode(payload, this.secret, this.hash);
    },
    getPayload: function (token) {
        return jwt.decode(token, this.secret);
    }
}

exports.db = {
	isUser: function(username) {
		if (typeof username == null)
			return false;
		User.findOne({name: username}, function(err, doc){
			if (doc == null) {
				console.log('hauria de retornar false');
				return false;
			}
			console.log('hauria de retornar true' + doc);
			return true;
		});
	}
}