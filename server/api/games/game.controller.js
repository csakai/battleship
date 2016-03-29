var _ = require('lodash'),
    util = require('../../util/board_util'),
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
            return data.setCpuBoard(util.randomCoords());
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
            return data.cpuMove(util.randomCoords(data.playerBoard));
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
        } else if (util.tenHits(data[name+'Board'])) {
            updateDoc.active = false;
            updateDoc.win = ('cpu' === name);
        }
        _.assign(data, updateDoc);
        return data;
    }
}

module.exports = GameCtrl;
