var GameCtrl = require('./game.controller');
var express = require('express');
var router = express.Router();

router
    .put('/', function(req, res, next) {
        var ctrl = new GameCtrl();
        ctrl.newGame()
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    });

router
    .route('/:id')
    .get(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        ctrl.getGame()
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    })
    .delete(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        ctrl.endGame()
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    });

router
    .route('/:id/ships')
    .post(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        var coords = req.body.coords;
        ctrl.placeShips(coords)
            .then(function(payload) {
                res.status(201).json(payload);
            }).catch(next);
    })
    .get(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        ctrl.getShips()
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    });

router
    .route('/:id/move')
    .post(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        var coord = req.body.coord;
        ctrl.move(coord)
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    })
    .get(function(req, res, next) {
        var id = req.params.id;
        var ctrl = new GameCtrl(id);
        ctr.getMove()
            .then(function(payload) {
                res.status(200).json(payload);
            }).catch(next);
    });

module.exports = router;
