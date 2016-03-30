(function() {
    var app = angular.module('battleship');
    app.controller('gameCtrl', ['gameService', gameCtrl]);
    function gameCtrl(gameService) {
        var vm = this;
        var startingCoords = [];
        vm.endGame = function() {
            gameService.endGame();
        };

        vm.newGame = function() {
            gameService.newGame()
                .then(function(data) {
                    vm.id = data._id;
                    return vm.id;
                });
        };

        vm.setBoard = function(coords) {
            gameService.setBoard(coords);
        };

        function _setCpuTurn(data) {
            vm.turn = false;
            return data;
        }

        function _setPlayerTurn(data) {
            vm.turn = true;
            return data;
        }

        function _handleTurn(boardName) {
            return function handleTurn(data) {
                var playerWin = boardName === 'cpuBoard';
                vm.win = data.win;
                _.merge(vm[boardName], data[boardName]);
                if (vm.win === playerWin) {
                    throw {
                        data: playerWin ? 'win' : 'lose'
                    };
                } else {
                    return;
                }
            };
        }

        function _handleError(err) {
            var modal = /*placeholder*/
            if (!err.status) {
                return gameModalService
                    .message(err.data);
            } else if (err.status === 500) {
                return gameModalService
                    .message(err.data)
                    .
            }
        }

        vm.addCoord = function(row, col) {
            var coords = gameService.getCoords(row, col);
            var index = _.indexOf(startingCoords, coords);
            if (index > -1) {
                startingCoords.splice(index, 0);
                vm.playerBoard[row][col] = '';
            } else {
                startingCoords.push(coords);
                vm.playerBoard[row][col] = 'S';
            }
        };

        vm.move = function(row, col) {
            var coords = gameService.getCoords(row, col);
            _setCpuTurn();
            gameService.move(coords)
                .then(function(data) {
                    vm.win = data.win;
                    _.merge(vm.cpuBoard, data.cpuBoard);
                    if (vm.win) {
                        throw {
                            data: "win"
                        };
                    } else {
                        return;
                    }
                }).then(gameService.cpuMove)
                .then(_setPlayerTurn)
                .then(function(data) {
                    vm.win = data.win;
                    _.merge(vm.playerBoard, data.playerBoard);
                    if (_.isBoolean(vm.win) && !vm.win) {
                        throw {
                            data: "lose"
                        };
                    } else {
                        return;
                    }
                })
                .catch(_handleError)
        }

    }
})();
