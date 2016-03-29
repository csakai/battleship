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
            var coordArr = _.map(coords, _coordMapFn(name));
            coordArr.forEach(_placeShip, self);
            resolve(self);
        });
    };
}
function _constructMoveMethod(name) {
    return function move(coord) {
        var self = this;
        return new Bluebird(function movePromise(resolve, reject) {
            var path = _getPath(name, coord),
                val = _.get(self, path),
                error;
            //val will be "S" for ship or '' for nothing
            if (util.okToMove(self, (name === 'cpu'))) {
                if (val && val.match(/[HM]/)) {
                    error = new Error('Repeated Move');
                    error.status = 400;
                    reject(error);
                } else {
                    _.set(self, path, _newVal(val));
                    resolve(self);
                }
            } else {
                error = new Error('Improper Turn');
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

function _getPath(name, coords) {
    return _(coords)
        .split('')
        .tap(function(arr){
            arr.splice(0, 0, name+"Board");
        }).join('.');
}

var _coordMapFn = _.curry(_getPath);

function _placeShip(path) {
    _.set(this, path, 'S');
}
