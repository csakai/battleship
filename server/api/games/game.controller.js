var _ = require('lodash'),
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
