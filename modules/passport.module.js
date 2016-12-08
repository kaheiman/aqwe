var express = require('express');
var router = express.Router();
var LocalStrategy  = require('passport-local').Strategy;
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('tnnRE4eaJCGYXEinmf9Wag');
var async = require('async');
var url = require('url');

var User = require('../models/user.model.js');
var Register = require('../models/register.model.js');

module.exports = function(passport){
	//check username is already in use
	passport.use('register', new LocalStrategy({
	        usernameField : 'username',
	        passwordField : 'password',
	        passReqToCallback : true		
		},
	  function(req, username, password, done) {
	  	console.log("hello work");
	  	var email = req.body.register.email;
	    User.getUserByUsername(username, function(err, user){
		   	if(err) throw err;
		   	if(user)
		   		return done(null, false, {message: 'Invalid username! The username is used already!'});
		   	else{
		   		//Create the newUser
		   		var newUser = new User({
		   			username: username,
		   			password: password,
		   			email: email
		   		});
				User.createUser(newUser, function(err, user){
					if(err) return err;
					else{
						return done(null, user); // this user will pass to passport serializuser
					}
				});
		   	}
	   	});
	  }));


	passport.serializeUser(function(user, done) {
		console.log('USERID: ', user.id);
	  done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializeUser');
	  User.getUserById(id, function(err, user) {
	    done(err, user);
	  });
	});






};