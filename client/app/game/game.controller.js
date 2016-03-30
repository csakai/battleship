(function() {
    var app = angular.module('battleship');
    app.controller('gameCtrl', ['$scope', 'gameService', gameCtrl]);
    function gameCtrl($scope, gameService) {
        var vm = this;
        var startingCoords = [];
        vm.endGame = function() {
            gameService.endGame();
        };

        vm.newGame = function() {
            gameService.newGame()
                .then(function(data) {
                    $scope.id = data._id;
                    return data;
                }).then($scope.getGame);
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
            // var modal = /*placeholder*/
            if (!err.status) {
                console.log('The game state changed.');
                console.log('You ' + (err.data.win ? 'won!' : 'lost!'));
                // return gameModalService
                //     .message(err.data);
            } else if (err.status === 500) {
                console.log('an error occurred');
                console.log(err);
                // return gameModalService
                //     .message(err.data)
                //     .
            }
        }

        vm.addCoord = function(row, col) {
            var coords = gameService.getCoords(row, col);
            var index = _.indexOf(startingCoords, coords);
            if (index > -1) {
                startingCoords.splice(index, 0);
                $scope.playerBoard[row][col] = '';
            } else {
                startingCoords.push(coords);
                $scope.playerBoard[row][col] = 'S';
            }
        };

        vm.requestCpuMove = function() {
            return gameService.cpuMove()
                .then(_setPlayerTurn)
                .then(function(data) {
                    vm.win = data.win;
                    $scope.playerBoard[data.row][data.col] = data.result;
                    if (_.isBoolean(vm.win) && !vm.win) {
                        throw {
                            data: "lose"
                        };
                    } else {
                        return;
                    }
                }).catch(_handleError);
        }

        vm.move = function(row, col) {
            var coords = gameService.getCoords(row, col);
            _setCpuTurn();
            gameService.move(coords)
                .then(function(data) {
                    vm.win = data.win;
                    $scope.cpuBoard[row][col] = data.result;
                    if (vm.win) {
                        throw {
                            data: "win"
                        };
                    } else {
                        return;
                    }
                }).then(vm.requestCpuMove)
                .catch(_handleError);
        }

    }
})();
