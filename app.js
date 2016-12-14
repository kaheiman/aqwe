var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var morgan = require('morgan');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('tnnRE4eaJCGYXEinmf9Wag');
var multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/mc_project');
var db = mongoose.connection;
var path = require('path');
var User = require('./models/user.model.js');
var Register = require('./models/register.model.js');
var McSchema = require('./models/mc.model.js');
var ObjectId = require('mongoose').Types.ObjectId; 
var json2csv = require('json2csv');
var fs = require('fs');


var routes = require('./route/index.js');
//var account = require('./route/api.account.route.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    //your store sets an expiration date on stored sessions, set resave as true
    resave: true,
    cookie: {}
}));

// Passport init
require('./modules/passport.module.js')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

// connect to aws s3
app.use(multipartyMiddleware);

//route
var apiRouter = express.Router();
require('./route/api.account.route.js')(apiRouter, bodyParser, passport, User, Register, McSchema, ObjectId, json2csv, fs);
app.use('/api', apiRouter);

app.use('/', routes);

// Set Port
app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});