var _ = require('lodash'),
    util = require('../../util/board_util'),
    Game = require('./game.model');

function GameCtrl(id) {
    if (id) {
        this.id = id;
    }
}
GameCtrl.prototype.moveProps = ['active', 'col', 'playerTurn', 'result', 'row', 'win'];

function returnMoveData(data) {
    return _.pick(this, this.moveProps);
};

GameCtrl.prototype.index = function index(query) {
    return Game.find(query, '-cpuBoard -playerBoard');
};

GameCtrl.prototype.newGame = function newGame() {
    var game = new Game();
    return game.save()
        .then(function(data) {
            return data;
        });
};

GameCtrl.prototype.getGame = function getGame() {
    return Game.findById(this.id);
};

GameCtrl.prototype.placeShips = function placeShips(coords) {
    return Game.findById(this.id)
        .then(function(data) {
            return data.setPlayerBoard(coords);
        }).then(function(data) {
            return data.setCpuBoard(util.randomCoords());
        }).then(function(data) {
            return data
                .update(data)
                .then(function() {
                    return data;
                });
        });
};

GameCtrl.prototype.move = function move(coord) {
    var self = this;
    this.coords = coord;
    return Game.findById(this.id)
        .then(function(data) {
            return data.playerMove(coord);
        }).then(self.applyMoveFn('cpu'))
        .then(returnMoveData.bind(self));
};

GameCtrl.prototype.cpuMove = function getMove() {
    var self = this;
    return Game.findById(this.id)
        .then(function(data) {
            var coords = util.randomCoords(data.playerBoard);
            self.coords = coords[0]
            return data.cpuMove(coords);
        }).then(self.applyMoveFn('player'))
        .then(returnMoveData.bind(self));
};

GameCtrl.prototype.endGame = function endGame() {
    var self = this;
    return Game.findById(this.id)
        .then(self.applyMoveFn())
        .then(returnMoveData.bind(self));
};

GameCtrl.prototype.applyMoveFn = function applyMove(name) {
    var self = this;
    return function applyMove(data) {
        var updateDoc = {};
        self.playerTurn = data.playerTurn;
        if (!name) {
            updateDoc.active = false;
            updateDoc.win = false;
        } else if (util.tenHits(data[name+'Board'])) {
            updateDoc.active = false;
            updateDoc.win = ('cpu' === name);
        }
        _.assign(data, updateDoc);
        _.assign(self, updateDoc);
        if (self.coords) {
            self.row = self.coords.charAt(0);
            self.col = self.coords.charAt(1);
            self.result = util.getResult(data, name, self.coords);
        }
        return data.update(data);
    }
}

module.exports = GameCtrl;
