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

GameCtrl.prototype.placeShips = function placeShips(coords) {
    return Game.findById(this.id, '-__v')
        .then(function(data) {
            return data.setPlayerBoard(coords);
        }).then(function(data) {
            return data.setCpuBoard(_randomCoords(10, []));
        }).then(function(data) {
            return data.save();
        });
};

GameCtrl.prototype.move = function move(coord) {
    return Game.findById(this.id, '-__v')
        .then(function(data) {
            return data.playerMove(coord);
        }).then(this.applyMoveFn('cpu'));
};

GameCtrl.prototype.cpuMove = function getMove() {
    return Game.findById(this.id, '-__v')
        .then(function(data) {
            var alreadyMapped = _getCoords(data.playerBoard);
            return data.cpuMove(_randomCoords(1, alreadyMapped));
        }).then(this.applyMoveFn('player'));
};

GameCtrl.prototype.endGame = function endGame() {
    var self = this;
    return Game.findById(this.id, '-__v')
        .then(this.applyMoveFn());
};

GameCtrl.prototype.applyMoveFn = function applyMove(name) {
    return function applyMove(data) {
        var updateDoc = {};
        if (!name) {
            updateDoc.active = false;
            updateDoc.win = false;
        } else if (_tenHits(data[name+'Board'])) {
            updateDoc.active = false;
            updateDoc.win = ('cpu' === name);
        }
        _.assign(data, updateDoc);
        return data;
    }
}

module.exports = GameCtrl;

function _getCoords(board, test) {
    var alreadyMapped = [];
    test = test || /[HMS]/
    _.forEach(board, function(val, key) {
        _.forEach(val, function(v, k) {
            if (v.match(test)) {
                alreadyMapped.push(key+k);
            }
        });
    });
    return alreadyMapped;
}

function _tenHits(board) {
    var hitCount = _getCoords(board, 'H').length;
    return hitCount === 10;
}

function _randomCoords(count, alreadyMapped) {
    return _(config.COORDS)
        .reject(alreadyMapped)
        .shuffle()
        .take(count)
        .value();
}
