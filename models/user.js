var mongoose = require("mongoose");
var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;

var User = new Schema({
    name 			: {type: String, required: true, trim: true , unique: true}
  , password		: {type: String, required: true}
  , description     : { type: String, required: true, trim: true }
  , ubicacions		: {type : Array , "default" : []}
  , accessos		: {type : Array , "default" : []}	
});

// Metòdes útils per la comprovació i creació de passwords
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);