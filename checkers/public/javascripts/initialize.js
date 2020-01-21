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
let ongoing = false;

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