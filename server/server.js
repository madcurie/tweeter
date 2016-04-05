//database sprint
//shortly express sprint
//testify

//test to make sure stuff gets added

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var http = require('http');

//routes
var events = require('./events.js')

//express instance
var app = express();

//config
var config = require('./_config');

//mongoose
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});

//config middleware
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../client/index.html'));
});
app.use(bodyParser.json());
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//main routes
app.use('/events', events)

//server config
var server = http.createServer(app);
server.listen(3000, function() {;
  console.log('Listening on port 3000');
});

module.exports = app;
