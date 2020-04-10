var board, game = new Chess()

//AI


const minimaxRoot = function (depth, game, isMaximisingPlayer){
    var newGameMoves = game.ugly_moves();

    let bestMove = -99999;

    let bestMoveFound

    for(let i=0; i<newGameMoves.length; i++){
        let newGameMove = newGameMoves[i]

        game.ugly_move(newGameMove)

        let val = minimax(depth -1, game, -10000, 10000, !isMaximisingPlayer)
        game.undo()

        if(val >= bestMove){
            bestMove = val
            bestMoveFound = newGameMove
        }
    }

    return bestMoveFound
    
}

const minimax = function(depth, game, alpha, beta, isMaximisingPlayer) {
    positionCount++

    if(depth === 0){
        return -evaluateBoard(game.board())
    }

    let newGameMoves = game.ugly_moves()

    
    if(isMaximisingPlayer){
        
        let bestMove = -9999;
        for(let i=0; i<newGameMoves.length; i++){
            game.ugly_move(newGameMoves[i])
    
            bestMove = Math.max(bestMove, minimax(depth-1, game, alpha, beta, !isMaximisingPlayer))
            game.undo()

            alpha = Math.max(alpha, bestMove)

            if(alpha >= beta){
                return bestMove;
            }
        }

        return bestMove
    }else{
        let bestMove = 9999;
        for(let i=0; i<newGameMoves.length; i++){
            game.ugly_move(newGameMoves[i])
    
            bestMove = Math.min(bestMove, minimax(depth-1, game, alpha, beta, !isMaximisingPlayer))
            game.undo()

            beta = Math.min(beta, bestMove)

            if(alpha >= beta){
                return bestMove
            }
        }

        return bestMove

    }

}

const evaluateBoard = function(board){
    var sum = 0;

    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            sum = sum + getPieceValue(board[i][j])
        }
    }

    return sum;
}


var getPieceValue = function (piece) {
    if (piece === null) {
        return 0;
    }
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') {
            return 10;
        } else if (piece.type === 'r') {
            return 50;
        } else if (piece.type === 'n') {
            return 30;
        } else if (piece.type === 'b') {
            return 30 ;
        } else if (piece.type === 'q') {
            return 90;
        } else if (piece.type === 'k') {
            return 900;
        }
        throw "Unknown piece type: " + piece.type;
    };

    var absoluteValue = getAbsoluteValue(piece, piece.color === 'w');
    return piece.color === 'w' ? absoluteValue : -absoluteValue;
};



//Board visualization
var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};

var makeBestMove = function () {
    var bestMove = getBestMove(game);
    game.ugly_move(bestMove);
    board.position(game.fen());
    if (game.game_over()) {
        alert('Game over');
    }
};

var positionCount;
var getBestMove = function (game) {
    if (game.game_over()) {
        alert('Game over');
    }

    positionCount = 0;
    var depth = parseInt($('#search-depth').find(':selected').text());

    var d = new Date().getTime();
    var bestMove = minimaxRoot(depth, game, true);
    var d2 = new Date().getTime();
    var moveTime = (d2 - d);
    var positionsPerS = ( positionCount * 1000 / moveTime);

    $('#position-count').text(positionCount);
    $('#time').text(moveTime/1000 + 's');
    $('#positions-per-s').text(positionsPerS);
    return bestMove;
};



var onDrop = function (source, target) {

    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    removeGreySquares();
    if (move === null) {
        return 'snapback';
    }

    window.setTimeout(makeBestMove, 250);
};

var onSnapEnd = function () {
    board.position(game.fen());
};

var onMouseoverSquare = function(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
};

var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
};

var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
};

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);