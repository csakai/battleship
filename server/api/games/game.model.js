var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var util = require('../../util/board_util');

var RowSchema = new Schema({
    a: { type: String, default: ''},
    b: { type: String, default: ''},
    c: { type: String, default: ''},
    d: { type: String, default: ''},
    e: { type: String, default: ''}
});

var BoardSchema = new Schema({
    a: RowSchema,
    b: RowSchema,
    c: RowSchema,
    d: RowSchema,
    e: RowSchema
});

var GameSchema = new Schema({
    playerBoard: BoardSchema,
    cpuBoard: BoardSchema,
    active: { type: Boolean, default: true },
    win: Boolean
});
/**
 * Methods
 */
GameSchema
    .methods
    .setCpuBoard = _constructBoardSetMethod.call(GameSchema, 'cpu');
GameSchema
    .methods
    .setPlayerBoard = _constructBoardSetMethod.call(GameSchema, 'player');

GameSchema
    .methods
    .cpuMove = _constructMoveMethod.call(GameSchema, 'player');

GameSchema
    .methods
    .playerMove = _constructMoveMethod.call(GameSchema, 'cpu');

module.exports = mongoose.model('Game', GameSchema);


function _constructBoardSetMethod(name) {
    return function setBoard(coords) {
        var self = this;
        return new Bluebird(function setBoardPromise(resolve, reject) {
            var coordArr = _.map(coords, util.coordMapFn(name));
            coordArr.forEach(_placeShip, self);
            resolve(self);
        });
    };
}
function _constructMoveMethod(name) {
    return function move(coord) {
        var self = this;
        return new Bluebird(function movePromise(resolve, reject) {
            var path = util.getPath(name, coord),
                //path to the board coordinate using dot notation
                val = _.get(self, path),
                //val will be "S" for ship or '' for nothing
                notFiredAt = !val || val === 'S',
                //indicates an empty space or ship
                properTurn = util.okToMove(self, (name === 'cpu')),
                //see util.okToMove method comment
                error;
            if (properTurn && notFiredAt) {
                _.set(self, path, _newVal(val));
                resolve(self);
            } else {
                error = new Error(!notFiredAt
                 ? 'Repeated Move'
                 : 'Improper Turn');
                error.status = 400;
                reject(error);
            }
        });
    };
}

function _newVal(val) {
    //H for Hit! M for Miss!
    return val === 'S'
     ? 'H'
     : 'M';
 }

function _placeShip(path) {
    _.set(this, path, 'S');
}
