var _ = require('lodash'),
    config = require('../config');

function getCoords(board, test) {
    var testObj = board.toObject();
    var alreadyMapped = [];
    if (!test) {
        test = /[HM]/;
    }
    _.forEach(testObj, function(val, key) {
        _.forEach(val, function(v, k) {
            if (v.match(test)) {
                alreadyMapped.push(key+k);
            }
        });
    });
    return alreadyMapped;
}

function countMoves(board, test) {
    return getCoords(board, test).length;
}

function tenHits(board) {
    return countMoves(board, 'H') === 10;
}

//Will get a full set of new ships if there is no playerBoard passed in.
//If a playerBoard is passed in, it is to indicate what moves a CPU can make
//within the game's normal flow.
function randomCoords(playerBoard) {
    var alreadyMapped = [],
        count = 10;;
    if (playerBoard) {
        alreadyMapped = getCoords(playerBoard);
        count = 1;
    }
    return _(config.COORDS)
        .difference(alreadyMapped)
        .shuffle()
        .take(count)
        .value();
}

function okToMove(game, playerTurn) {
    //returns true if it is the player's turn and the boards
    //have an equal amount of moves made on them.
    //returns ture if it is the cpu's turn and the amount of
    //moves on the boards are off by 1, since that means the
    //player just made a move.
    var offset = playerTurn
     ? 0
     : 1;
    var testValue = countMoves(game.playerBoard) - countMoves(game.cpuBoard);
    return testValue === offset;
}

module.exports = {
    getCoords: getCoords,
    randomCoords: randomCoords,
    okToMove: okToMove,
    tenHits: tenHits
};
