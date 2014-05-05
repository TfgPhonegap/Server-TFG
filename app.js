
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , namespace = require('express-namespace')
  , mongoose = require("mongoose")
  , path = require('path');


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
});

// PERMETRE CRIDES CORS
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT");
  next();
 
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

mongoose.connect('mongodb://localhost/tfg');
routes = require('./routes')(app);


http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
  console.log("Express server listening on port " + app.get('port'));
});


