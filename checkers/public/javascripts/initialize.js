let board = document.getElementsByClassName("board")[0];
let color = null;
let playerType = null;
let gameState = null;
let from = null;
let myTurn = false;
let isJump = false;
let haveToJump = false;
let blackPiecesTaken = 0;
let whitePiecesTaken = 0;
let blackMinutes = 10;
let blackSeconds = 0;
let whiteMinutes = 10;
let whiteSeconds = 0;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}
let fraud = new sound("/audio/fraud.mp4");

Array.from(board.children).forEach(function(cell) {
    cell.onclick = function(elem) {
        if (elem.target.getAttribute("data-piece") === "true") {
            from = elem.target;
        }
        else {
            let move = isLegalMove(from, elem.target, 1);
            if (from && move.legal && (!haveToJump || move.isJump)) {
                Messages.O_MOVE_MADE.data.from = {
                    row: from.getAttribute("data-row"),
                    column: from.getAttribute("data-column")
                };
                Messages.O_MOVE_MADE.data.to = {
                    row: elem.target.getAttribute("data-row"),
                    column: elem.target.getAttribute("data-column")
                };
                isJump = move.isJump;
                haveToJump = false;
                socket.send(JSON.stringify(Messages.O_MOVE_MADE));
                from = null;
            }
            else {
                fraud.play();
            }
        }
    }
});