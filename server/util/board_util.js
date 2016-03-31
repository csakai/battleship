var _ = require('lodash'),
    config = require('../config');

//creates the path to the booard coordinate using the board name
//and coordinates.
function getPath(name, coords) {
    return _(coords)
        .split('')
        .tap(function(arr){
            arr.splice(0, 0, name+"Board");
        }).join('.');
}

//creates a curried version of getPath that
//can be used as a composable function, accepting
//the name, and returning a function that accepts coords
var coordMapFn = _.curry(getPath);

function getResult(data, name, coords) {
    var path = getPath(name, coords);
    return _.get(data, path);
}

function getCoords(board, test) {
    var testObj = board;
    if (_.isFunction(board.toObject)) {
        testObj = board.toObject();
    }
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
    // Wraps config.COORDS array in a lodash wrapper
    // Removes the already mapped coordinates from the array,
    // Randomizes the order of the array,
    // Returns *count* from the start of the array
    // Explicitly returns the array within the lodash wrapper
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
    var testValue = countMoves(game.cpuBoard) - countMoves(game.playerBoard);
    return testValue === offset;
}

function prepGameViewForClient(game) {
    var clientGame = game.toObject(),
        shipCoords;
    if (game.cpuBoard) {
        shipCoords = getCoords(game.cpuBoard, 'S');
        _.forEach(shipCoords, function(coord) {
            _.set(clientGame, getPath('cpu', coord), '');
        });
    }
    return clientGame;
}

module.exports = {
    getPath: getPath,
    coordMapFn: coordMapFn,
    getCoords: getCoords,
    getResult: getResult,
    randomCoords: randomCoords,
    okToMove: okToMove,
    prepGameViewForClient: prepGameViewForClient,
    tenHits: tenHits
};
