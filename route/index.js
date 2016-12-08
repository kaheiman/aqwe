var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	res.sendFile('index.html');
})

router.get('/login', function(req,res){
	res.redirect('index.html');
})

router.get('/register', function(req, res){
	res.redirect('index.html');
})

module.exports = router;