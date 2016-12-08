var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var RegisterSchema = mongoose.Schema({
	email: {
		type: String
	},
	keyCode: {
		type: String 
	}
});

var Register = module.exports = mongoose.model('Register', RegisterSchema);

module.exports.checkEmailValidate = function(email, callback){
	var query ={email: email};
	Register.findOne(query, callback);
}

module.exports.createRegisterUser = function(newUser, callback){
		newUser.save(callback);
}

module.exports.checkKeyCode = function(key, email, callback){
	var query = {email: email};
	Register.findOne(query, function(err, info){
		if(err) callback(err);
		else{
			console.log('i am here ', info.keyCode, key);
			if(info.keyCode == key){
				callback(null, true);
			}
		}
	});
}