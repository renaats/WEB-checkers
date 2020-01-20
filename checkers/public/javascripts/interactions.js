var socket = new WebSocket("ws://localhost:3001");
var message;
let element = document.getElementById("submit-text");
element.addEventListener("submit", function(event) {
    let messageText = document.getElementById("message-text").value;
    event.preventDefault();
    console.log(event);
    console.log(messageText);
    Messages.O_MESSAGE.data = messageText;
    let chat = document.getElementById("chat");
    chat.innerHTML += "You: " + messageText + "<br>";
    document.getElementById("message-text").value = "";

    socket.send(JSON.stringify(Messages.O_MESSAGE));
});
socket.onopen = function(){
};
socket.onmessage = function(event){
    message = JSON.parse(event.data);
    if (message.type == "PLAYER-TYPE") {
        playerType = message.data;
        if (message.data == "A") {
            color = "white";
        }
        else {
            color = "black";
        }
        document.getElementById("color").innerHTML = color;
    }
    if (message.type == "GAME-STATE") {
        gameState = message.data;
        otherPlayer = 'a';
        if (playerType == "A") {
            otherPlayer = 'b';
        }
        if (gameState == "1 joined") {
            document.getElementById("game-state").innerHTML = "Waiting for the other player!";
        }
        else if (gameState == "2 joined") {
            document.getElementById("game-state").innerHTML = "Starting!";
        }
        else if (gameState == playerType.toLowerCase() + " move") {
            document.getElementById("game-state").innerHTML = "Your turn!";
        }
        else if (gameState == otherPlayer + " move") {
            document.getElementById("game-state").innerHTML = "Wait for your turn!";
        }
        else if (gameState == playerType.toLowerCase() + " wins") {
            document.getElementById("game-state").innerHTML = "Your won!";
        }
        else if (gameState == otherPlayer + " wins") {
            document.getElementById("game-state").innerHTML = "Your lost!";
        }
        else if (gameState == "aborted") {
            document.getElementById("game-state").innerHTML = "Your opponent abandoned!";
        }
        else {
            document.getElementById("game-state").innerHTML = "Unexpected statusx";
        }
    }
    if (message.type == "START-TURN") {
        haveToJump = false;
        myTurn = true;
        Array.from(board.children).forEach(function(cell) {
            forceJump(cell);
        });
        console.log(playerType + " turn started, forceJump: " + haveToJump);

        
        let hasLost = 1;
        Array.from(board.children).forEach(function(cells) {
            if ((cells.innerHTML == '<img class="' + color + '-piece">'||cells.innerHTML == '<img class="' + color + '-king">')
            && canMove(cells)) {
                hasLost = 0;
            }
        });
        if (hasLost) {
            Messages.O_GAME_WON_BY.data = playerType;
            socket.send(JSON.stringify(Messages.O_GAME_WON_BY));
        }
    }
    if (message.type == "TAKE-PIECE") {
        let cell = document.querySelectorAll('[data-row="'+message.data.row+'"][data-column="'+message.data.column+'"]')[0];
        cell.innerHTML = "";
        cell.setAttribute("data-piece", "false");
    }
    if (message.type == "MOVE-MADE") {
        let from = document.querySelectorAll('[data-row="'+message.data.from.row+'"][data-column="'+message.data.from.column+'"]')[0];
        let to = document.querySelectorAll('[data-row="'+message.data.to.row+'"][data-column="'+message.data.to.column+'"]')[0];
        to.innerHTML = from.innerHTML;
        from.innerHTML = "";
        to.setAttribute("data-piece", "true");
        from.setAttribute("data-piece", "false");
        if (to.getAttribute("data-row") == "1" && to.children[0].getAttribute("class") == "white-piece") {
            to.children[0].setAttribute("class", "white-king");
        }
        if (to.getAttribute("data-row") == "8" && to.children[0].getAttribute("class") == "black-piece") {
            to.children[0].setAttribute("class", "black-king");
        }
        

        if (myTurn == true) {
            forceJump(to);
            if (!haveToJump || !isJump) {
                socket.send(Messages.S_END_TURN);
                myTurn = false;
            }	
        }
        else {
            isJump = false;
        }
    }
    if (message.type == "MESSAGE") {
        let chat = document.getElementById("chat");
        chat.innerHTML += "Opponent: " + message.data + "<br>";
    }
};