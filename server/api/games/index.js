var _ = require('lodash');
var GameCtrl = require('./game.controller');
var express = require('express');
var router = express.Router();
var util = require('../../util/board_util');

function _serviceReq(req, method, paramName) {
    var ctrl = new GameCtrl(req.params.id);
    var param;
    if (paramName) {
        param = _.get(req, paramName);
    }
    return ctrl[method](param)
}

router
    .route('/')
    .get(function(req, res, next) {
        _serviceReq(req, 'index', 'query')
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    })
    .put(function(req, res, next) {
        _serviceReq(req, 'newGame')
            .then(util.prepGameViewForClient)
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    });

router
    .route('/:id')
    .get(function(req, res, next) {
        _serviceReq(req, 'getGame')
            .then(util.prepGameViewForClient)
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
    .put(function(req, res, next) {
        _serviceReq(req, 'placeShips', 'body.coords')
            .then(util.prepGameViewForClient)
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    });

router
    .route('/:id/move')
    .put(function(req, res, next) {
        _serviceReq(req, 'move', 'body.coords')
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
