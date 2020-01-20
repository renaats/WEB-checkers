var game = function(gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 joined";
};

game.prototype.transitionStates = {};
game.prototype.transitionStates["0 joined"] = 0;
game.prototype.transitionStates["1 joined"] = 1;
game.prototype.transitionStates["2 joined"] = 2;
game.prototype.transitionStates["a move"] = 3;
game.prototype.transitionStates["b move"] = 4;
game.prototype.transitionStates["a wins"] = 5;
game.prototype.transitionStates["b wins"] = 6;
game.prototype.transitionStates["aborted"] = 7;

game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

game.prototype.isValidTransition = function(from, to) {
    console.assert(
        typeof from == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof from
    );
    console.assert(
        typeof to == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof to
    );
    console.assert(
        from in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        from
    );
    console.assert(
        to in game.prototype.transitionStates == true,
        "%s: Expecting %s to be a valid transition state",
        arguments.callee.name,
        to
    );

    let i, j;
    if (!(from in game.prototype.transitionStates)) {
        return false;
    } else {
        i = game.prototype.transitionStates[from];
    }

    if (!(to in game.prototype.transitionStates)) {
        return false;
    } else {
        j = game.prototype.transitionStates[to];
    }

    return game.prototype.transitionMatrix[i][j] > 0;
};

game.prototype.isValidState = function(s) {
    return s in game.prototype.transitionStates;
};

game.prototype.setStatus = function(w) {
    console.assert(
        typeof w == "string",
        "%s: Expecting a string, got a %s",
        arguments.callee.name,
        typeof w
    );
  
    if (
        game.prototype.isValidState(w) &&
        game.prototype.isValidTransition(this.gameState, w)
    ) {
        this.gameState = w;
        console.log("[STATUS] %s", this.gameState);
    } else {
        return new Error(
            "Impossible status change from %s to %s",
            this.gameState,
            w
        );
    }
};

game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState === "2 joined" || this.gameState === "a move" || this.gameState === "b move";
};

game.prototype.addPlayer = function(p) {
    console.assert(
        p instanceof Object,
        "%s: Expecting an object (WebSocket), got a %s",
        arguments.callee.name,
        typeof p
    );

    if (this.gameState != "0 joined" && this.gameState != "1 joined") {
        console.log(this.gameState);
        return new Error(
            "Invalid call to addPlayer, current state is %s",
            this.gameState
        );
    }

    
    //  revise the game state
    

    var error = this.setStatus("1 joined");
    if (error instanceof Error) {
        this.setStatus("2 joined");
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    } else {
        this.playerB = p;
        return "B";
    }
};

game.prototype.startGame = function() {
    let first = Math.floor(Math.random() * 2);
    if (first == 0) {
      this.setStatus("a move");
    }
    else {
      this.setStatus("b move");
    }
}

module.exports = game;