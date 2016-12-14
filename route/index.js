var express = require('express');
var router = express.Router();
var User = require('../models/user.model.js');

router.get('/myMc', function(req, res, next){
	console.log("asdasdasd");
	if(!req.session.key)
		res.redirect('/login');
	else{
		//check whether the id exists
		Authenticate(req.session.key, function(auth){
			console.log('auth: ', auth);
			if(auth) next();
		});
	}
})

router.use('*', function(req, res, next){
	if(req.session.key)
		console.log("hello i am here: ", req.session.key);
	res.sendFile('index.html', {root: './public'});
	console.log("come on bacy");
})

function Authenticate(id, callback){
	console.log('id : ', id);
	User.findOne({'_id': id}, function(err, user){
		if(err) throw err;
		else
			callback(user);
	});
}

module.exports = router;