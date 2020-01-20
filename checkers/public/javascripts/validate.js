let board = document.getElementsByClassName("board")[0];
let color = null;
let playerType = null;
let gameState = null;
let from = null;
let myTurn = null;
let isJump = false;
let haveToJump = false;
let blackPiecesTaken = 0;
let whitePiecesTaken = 0;
let blackMinutes = 10;
let blackSeconds = 0;
let whiteMinutes = 10;
let whiteSeconds = 0;


var cols = document.getElementsByClassName('black-piece');
for(i = 0; i < cols.length; i++) {
    cols[i].src = "images/Black.png";
}
var cols = document.getElementsByClassName('black-king');
for(i = 0; i < cols.length; i++) {
    cols[i].src = "images/Black-king.png";
}
var cols = document.getElementsByClassName('white-piece');
for(i = 0; i < cols.length; i++) {
    cols[i].src = "images/White.png";
}
var cols = document.getElementsByClassName('white-king');
for(i = 0; i < cols.length; i++) {
    cols[i].src = "images/White-king.png";
}

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
        }
    }
});

function isLegalMove(from, to, remove) {
    let toRow = parseInt(to.getAttribute("data-row"));
    let toColumn = parseInt(to.getAttribute("data-column"));
    let fromRow = parseInt(from.getAttribute("data-row"));
    let fromColumn = parseInt(from.getAttribute("data-column"));
    
    let legal = isOnBoard(fromRow, fromColumn) && isOnBoard(toRow, toColumn) && to.getAttribute("data-piece") == "false";
    let jump = 0; 
    if ((toRow + toColumn) % 2 != 1 || myTurn != 1) {
        legal = 0;
    }
    if (Math.abs(toColumn - fromColumn) !== Math.abs(toRow - fromRow)) {
        legal = 0;
    }
    if (legal && from.children[0].getAttribute("class") == color + "-piece") {
        if (Math.abs(fromRow - toRow) > 2) {
            legal = 0;
        }
        else if (Math.abs(fromRow - toRow) == 1 && haveToJump && remove) {
            legal = 0;
        }
        else if (Math.abs(fromRow - toRow) == 2) {
            let midRow = ((fromRow + toRow) / 2).toString();
            let midColumn = ((fromColumn + toColumn) / 2).toString();
            let cell = document.querySelectorAll('[data-row="'+midRow+'"][data-column="'+midColumn+'"]')[0];
            if (cell.getAttribute("data-piece") === "false") {
                legal = 0;
            }				
            else if (cell.children[0].getAttribute("class") != color + '-piece' && cell.children[0].getAttribute("class") != color + '-king') {
                if (remove) {
                    Messages.O_TAKE_PIECE.data = {
                        row: midRow,
                        column: midColumn
                    };
                    socket.send(JSON.stringify(Messages.O_TAKE_PIECE));
                }
                jump = 1;
            }
            else {
                legal = 0;
            }
        }
        else if (toRow <= fromRow && color == "black") {
            legal = 0;
        }
        else if (toRow >= fromRow && color == "white") {
            legal = 0;
        }
    }
    else if (legal && from.children[0].getAttribute("class") == color + "-king") {
        let csign = 1;
        let rsign = 1;
        if(fromRow > toRow) {
            rsign=-1;
        }
        if(fromColumn>toColumn) {
            csign=-1;
        }
        if (Math.abs(fromRow - toRow) >= 2) {
            let midRow = "";
            let midColumn="";
            let middlePieces = 0;
            let rr = fromRow + rsign;
            let cc = fromColumn + csign;
            while (rr != toRow && cc != toColumn) {
                midRow = rr.toString();
                midColumn = cc.toString();
                let cell = document.querySelectorAll('[data-row="'+midRow+'"][data-column="'+midColumn+'"]')[0];
                
                if (cell.children[0].getAttribute("class") == color + '-piece' || cell.children[0].getAttribute("class") == color + '-king') {
                    legal=0;
                }
                else if (cell.innerHTML != "") {
                    middlePieces++;
                }
                rr += rsign;
                cc += csign;
            }
            if(middlePieces>1) {
                legal=0;
            }
            else if(middlePieces == 1 && legal) {
                rr = fromRow + rsign;
                cc = fromColumn + csign;
                while (rr != toRow && cc != toColumn) {
                    midRow=rr.toString();
                    midColumn=cc.toString();
                    if (remove) {
                        Messages.O_TAKE_PIECE.data = {
                            row: midRow,
                            column: midColumn
                        };
                        socket.send(JSON.stringify(Messages.O_TAKE_PIECE));
                    }
                    jump = 1;
                    rr += rsign;
                    cc += csign;
                }
            }
            else if (haveToJump && remove) {
                legal = 0;
            }
        }
        else if (haveToJump && remove) {
            legal = 0;
        }
    }
    else {
        legal = 0;
    }
    return {
        legal: legal,
        isJump: jump
    };
}

function isOnBoard(row, column) {
    if (row >= 1 && row <=8 && column >= 1 && column <= 8) {
        return true;
    }
    return false;
}

function canMove(cell) {
    let row = parseInt(cell.getAttribute("data-row"));
    let column = parseInt(cell.getAttribute("data-column"));
    let move = 0;
    for (let i = 1; i <= 2; i++) {
        if (isOnBoard(row+i, column+i) && isLegalMove(cell, document.querySelectorAll('[data-row="'+(row+i).toString()+'"][data-column="'+(column+i).toString()+'"]')[0], 0).legal) {
            move = 1;
        }
        if (isOnBoard(row+i, column-i) && isLegalMove(cell, document.querySelectorAll('[data-row="'+(row+i).toString()+'"][data-column="'+(column-i).toString()+'"]')[0], 0).legal) {
            move = 1;
        }
        if (isOnBoard(row-i, column+i) && isLegalMove(cell, document.querySelectorAll('[data-row="'+(row-i).toString()+'"][data-column="'+(column+i).toString()+'"]')[0], 0).legal) {
            move = 1;
        }
        if (isOnBoard(row-i, column-i) && isLegalMove(cell, document.querySelectorAll('[data-row="'+(row-i).toString()+'"][data-column="'+(column-i).toString()+'"]')[0], 0).legal) {
            move = 1;
        }
    }
    return move;
}

function forceJump(cell){
    if (cell.children.length == 0) {
        return;
    }
    if (cell.children[0].getAttribute("class") == color + '-piece' || cell.children[0].getAttribute("class") == color + '-king') {
        let row = parseInt(cell.getAttribute("data-row"));
        let column = parseInt(cell.getAttribute("data-column"));
        let j = 7;
        if (cell.children[0].getAttribute("class") == color + '-piece') {
            j = 2;
        }
        for (let i = 2; i <= j; i++) {
            if (isOnBoard(row + i, column + i)) {
                let target = document.querySelectorAll('[data-row="'+(row+i).toString()+'"][data-column="'+(column+i).toString()+'"]')[0];
                if (isLegalMove(cell, target, 0).legal && isLegalMove(cell, target, 0).isJump) {
                    haveToJump = true;
                }
            }
            if (isOnBoard(row + i, column - i)) {
                let target = document.querySelectorAll('[data-row="'+(row+i).toString()+'"][data-column="'+(column-i).toString()+'"]')[0];
                if (isLegalMove(cell, target, 0).legal && isLegalMove(cell, target, 0).isJump) {
                    haveToJump = true;
                }
            }
            if (isOnBoard(row - i, column + i)) {
                let target = document.querySelectorAll('[data-row="'+(row-i).toString()+'"][data-column="'+(column+i).toString()+'"]')[0];
                if (isLegalMove(cell, target, 0).legal && isLegalMove(cell, target, 0).isJump) {
                    haveToJump = true;
                }
            }
            if (isOnBoard(row - i, column - i)) {
                let target = document.querySelectorAll('[data-row="'+(row-i).toString()+'"][data-column="'+(column-i).toString()+'"]')[0];
                if (isLegalMove(cell, target, 0).legal && isLegalMove(cell, target, 0).isJump) {
                    haveToJump = true;
                }
            }	
        }
    }
}