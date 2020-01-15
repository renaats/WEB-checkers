/* 
 In-memory game statistics "tracker".
 TODO: as future work, this object should be replaced by a DB backend.
*/

var gameStatus = {
    since: Date.now() /* since we keep it simple and in-memory, keep track of when this object was created */,
    gamesPlayed: 0 /* number of games initialized */,
    movesMade: 0 /* number of games aborted */,
    playersOnline: 0 /* number of games successfully completed */
  };

  module.exports = gameStatus;