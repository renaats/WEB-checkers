(function(exports) {

    exports.T_GAME_STATE = "GAME-STATE";
    exports.O_GAME_STATE = {
        type: exports.T_GAME_STATE,
        data: null
    };

    exports.T_MOVE_MADE = "MOVE-MADE";
    exports.O_MOVE_MADE = {
        type: exports.T_MOVE_MADE,
        from: {
            row: null,
            column: null
        },
        to: {
            row: null,
            column: null
        }
    };

    exports.T_END_TURN = "END-TURN";
    exports.O_END_TURN = {
        type: exports.T_END_TURN
    };
    exports.S_END_TURN = JSON.stringify(exports.O_END_TURN);

    exports.T_START_TURN = "START-TURN";
    exports.O_START_TURN = {
        type: exports.T_START_TURN
    };
    exports.S_START_TURN = JSON.stringify(exports.O_START_TURN);

    /*
     * Client to server: game is complete, the winner is ...
     */
    exports.T_GAME_WON_BY = "GAME-WON-BY";
    exports.O_GAME_WON_BY = {
      type: exports.T_GAME_WON_BY,
      data: null
    };
  
    /*
     * Server to client: abort game (e.g. if second player exited the game)
     */
    exports.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);
  
    /*
     * Server to client: set as player A
     */
    exports.T_PLAYER_TYPE = "PLAYER-TYPE";
    exports.O_PLAYER_A = {
      type: exports.T_PLAYER_TYPE,
      data: "A"
    };
    exports.S_PLAYER_A = JSON.stringify(exports.O_PLAYER_A);
  
    /*
     * Server to client: set as player B
     */
    exports.O_PLAYER_B = {
      type: exports.T_PLAYER_TYPE,
      data: "B"
    };
    exports.S_PLAYER_B = JSON.stringify(exports.O_PLAYER_B);
  
    /*
     * Player B to server OR server to Player A: guessed character
     */
    exports.T_MAKE_A_MOVE = "MAKE-A-MOVE";
    exports.O_MAKE_A_MOVE = {
      type: exports.T_MAKE_A_MOVE,
      data: null
    };
    //exports.S_MAKE_A_MOVE does not exist, as data needs to be set
  
    /*
     * Server to Player A & B: game over with result won/loss
     */
    exports.T_GAME_OVER = "GAME-OVER";
    exports.O_GAME_OVER = {
      type: exports.T_GAME_OVER,
      data: null
    };
  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server