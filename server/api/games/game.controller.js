var _ = require('lodash'),
    config = require('../../config'),
    Game = require('./game.model');

function GameCtrl(id) {
    if (id) {
        this.id = id;
    }
}

GameCtrl.prototype.newGame = function newGame() {
    var game = new Game();
    return game.save()
        .then(function(data) {
            return _.omit(data.toObject(), '__v');
        });
};

GameCtrl.prototype.getGame = function getGame() {
    return Game.findById(this.id, '-__v');
};

function _alreadyMapped(board) {
    var alreadyMapped = [];
    _.forEach(board, function(val, key) {
        _.forEach(val, function(v, k) {
            if (v.match(/[HMS]/)) {
                alreadyMapped.push(key+k);
            }
        });
    });
    return alreadyMapped;
}
function _randomCoords(count, alreadyMapped) {
    return _(config.COORDS)
        .reject(alreadyMapped)
        .shuffle()
        .take(count);
}
GameCtrl.placeShips = function placeShips(coords) {
    return Game.findById(this.id, '-__v')
        .then(function(data) {
            data.board = {
                name: 'player',
                coordinates: coords
            };
            data.board = {
                name: 'cpu',
                coordinates: _randomCoords(10, [])
            };
        })
};



GameCtrl.prototype.endGame = function endGame() {
    var self = this;
    return Game.findById(this.id, '-__v')
        .then(function (data) {
            return self.setWinState(data, 'cpu');
        });
};

GameCtrl.prototype.setWinState = function setWinState(game, winner) {
    var updateDoc = {
        active: false,
        win: (winner === 'player')
    };
    return game.update(updateDoc);
};

module.exports = GameCtrl;
