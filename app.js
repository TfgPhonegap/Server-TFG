
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , https = require('https')
  , namespace = require('express-namespace')
  , mongoose = require("mongoose")
  , path = require('path')
  , passport = require('passport')
  , fs = require('fs')
  , privateKey  = fs.readFileSync('data/certificatServerAplicacio/server.key', 'utf8')
  , certificate = fs.readFileSync('data/certificatServerAplicacio/server.crt', 'utf8')
  , credentials = {key: privateKey, cert: certificate};


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  // required for passport
  //app.use(express.session({ secret: 'contrassenyasupersecreta' })); // session secret
  app.use(passport.initialize());
  //app.use(passport.session()); // persistent login sessions
});

// PERMETRE CRIDES CORS
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT" , "OPTIONS", "DELETE");
  next();
 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

mongoose.connect('mongodb://localhost/tfg');
routes = require('./routes')(app, passport);

var server = http.createServer(app);

server.listen(app.get('port'), '0.0.0.0', function(){
  console.log("Express server listening on port " + app.get('port'));
});

https.createServer(credentials, app).listen(3043, '0.0.0.0', function(){
  console.log("Express HTTPS server listening on port " + 3043);
});


