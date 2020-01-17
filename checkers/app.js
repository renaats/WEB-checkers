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
var Game = require("./game");

var port = process.argv[2];
var app = express();
  
var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};

setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);

var currentGame = new Game(stats.ongoingGames++);
var connectionID = 0;

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
  console.log("connected");
  stats.playersOnline++;
  let con = ws;
  con.id = connectionID++;
  let playerType = currentGame.addPlayer(con);
  websockets[con.id] = currentGame;

  console.log(
    "Player %s placed in game %s as %s",
    con.id,
    currentGame.id,
    playerType 
  );

  con.send(playerType == "A" ? messages.S_PLAYER_A : messages.S_PLAYER_B);

  con.on("message", function incoming(message) {
      console.log("[LOG] " + message);
      let oMsg = JSON.parse(message);

      let gameObj = websockets[con.id];
      let isPlayerA = gameObj.playerA == con ? true : false;

      if (isPlayerA) {
        console.log("Message from player A: " + message);
      }
      else {
        console.log("Message from player B: " + message);
      }
  });
  con.on("close", function(code) {
    console.log("disconnected");
    stats.playersOnline--;
    console.log(con.id + " disconnected ...");
    if (code == "1001") {
         let gameObj = websockets[con.id];

        if (gameObj.isValidTransition(gameObj.gameState, "aborted")) {
          gameObj.setStatus("aborted");

          try {
            gameObj.playerA.close();
            gameObj.playerA = null;
          } catch (e) {
            console.log("Player A closing: " + e);
          }

          try {
            gameObj.playerB.close();
            gameObj.playerB = null;
          } catch (e) {
            console.log("Player B closing: " + e);
          }
        }
        else if (gameObj.gameState === "2 joined") {
          gameObj.setStatus("1 joined");
          if (gameObj.playerA === con) {
            gameObj.playerA = null;
          } else {
            gameObj.playerB = null;
          }

          try {
            gameObj.playerB = null;
          } catch (e) {
            console.log("Player B closing: " + e);
          }
        }
        else if (gameObj.gameState === "1 joined") {
          gameObj.setStatus("0 joined");
          if (gameObj.playerA === con) {
            gameObj.playerA = null;
          } else {
            gameObj.playerB = null;
          }
        }
      }
  });
});

module.exports = app;

server.listen(3001);