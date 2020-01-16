var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var stats = require("./statistics");
var express = require("express");
var http = require("http");
var websocket = require("ws");
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();

var server = http.createServer(app);
const wss = new websocket.Server({ server });

// app.use(function(req, res, next) {
// 	console.log('[LOG] %s\t%s\t%s\t%s',
// 		new Date().toISOString(), // timestamp
// 		req.connection.remoteAddress, // client's address
// 		req.method, // HTTP method
// 		req.url // requested URL
// 	);
// 	next(); // call on to next component
// });

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get("/stats/", function(req, res, next) {
  res.sendFile(__dirname + '/statistics.js');  
});

app.get("/updateStats/", function(req, res) {
  res.json(stats);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

wss.on("connection", function(ws) {
  stats.playersOnline++;
  console.log(stats.playersOnline);
  ws.on("message", function incoming(message) {
      console.log("[LOG] " + message);
  });
  ws.on("close", function() {
    stats.playersOnline--;
  });
});

module.exports = app;

server.listen(3001);