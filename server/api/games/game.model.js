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
    .set(function(coordinates) {
        var val,
            newVal,
            path = 'cpuBoard.';
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
        this._path = coordObj.name + '.';
        coordArr.forEach(placeShip, this);
    });

module.exports = mongoose.model('Game', GameSchema);
