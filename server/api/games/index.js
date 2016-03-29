var GameCtrl = require('./game.controller');
var express = require('express');
var router = express.Router();

function _serviceReq(req, method, paramRequired) {
    var ctrl = new GameCtrl(req.params.id);
    var param;
    if (paramRequired) {
        param = req.body.coords;
    }
    return ctrl[method](param);
}


router
    .put('/', function(req, res, next) {
        _serviceReq(req, 'newGame')
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    });

router
    .route('/:id')
    .get(function(req, res, next) {
        _serviceReq(req, 'getGame')
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    })
    .delete(function(req, res, next) {
        _serviceReq(req, 'endGame')
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    });

router
    .route('/:id/ships')
    .post(function(req, res, next) {
        _serviceReq(req, 'placeShips', true)
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    });

router
    .route('/:id/move')
    .post(function(req, res, next) {
        _serviceReq(req, 'move', true)
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    })
router
    .route('/:id/cpu_move')
    .post(function(req, res, next) {
        _serviceReq(req, 'cpuMove')
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    });

module.exports = router;
