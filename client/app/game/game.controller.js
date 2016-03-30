(function() {
    var app = angular.module('battleship');
    app.controller('gameCtrl', ['gameService', gameCtrl]);
    function gameCtrl(gameService) {
        var vm = this;

        vm.endGame = function() {
            gameService.endGame();
        };

        vm.newGame = function() {
            gameService.newGame();
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

            }
            if (err.data === 'win') {

            }
        }

        vm.move = function(coords) {
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
                .catch(gameService.handleError)
        }

    }
})();
