var Bluebird = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

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
 * Virtuals
 */
function coordinateMapper(coords) {
    return coords.split('').join('.');
}

GameSchema
    .virtual('move')
    .set(function(coordObj) {
        var coordinates = coordObj.coords,
            val,
            newVal,
            path = coordObj.name + 'Board.';
        path += coordinateMapper(coordinates)
        //Will be "S" for ship or '' for nothing
        val = _.get(this, path);
        if (val === 'S') {
            //HIT!
            newVal = 'H';
        }  else {
            //MISS!
            newVal = 'M';
        }
        _.set(this, path, newVal);
    });

function placeShip(coord) {
    _.set(this, (this._path + coord), 'S');
}

GameSchema
    .virtual('board')
    .set(function(coordObj) {
        var coordArr = _.map(coordObj.coordinates, coordinateMapper);
        this._path = coordObj.name + 'Board.';
        coordArr.forEach(placeShip, this);
    });

/**
 * Methods
 */

function _constructMoveMethod(name) {
    var self = this;
    return function move(coord) {
        return new Bluebird(function(resolve, reject) {
            var coordObj = {
                name: name,
                coords: coord
            };
            self.move = coordObj;
            return self.save();
        });
    };
}

GameSchema
    .methods
    .cpuMove = _constructMoveMethod.call(GameSchema, 'player');

GameSchema
    .methods
    .playerMove = _constructMoveMethod.call(GameSchema, 'cpu');

module.exports = mongoose.model('Game', GameSchema);
