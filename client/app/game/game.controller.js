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

        vm.setBoard = function() {
            if (startingCoords.length < 10) {
                console.log("Please add " + (10 - startingCoords.length) + " more ships.");
                return;
            }
            gameService.setBoard(startingCoords)
                .then($scope.getGame);
        };

        function _setCpuTurn(data) {
            $scope.cBoard.disabled = true;
            return data;
        }

        function _setPlayerTurn(data) {
            $scope.cBoard.disabled = false;
            return data;
        }

        function _handleError(err) {
            // var modal = /*placeholder*/
            if (!err.status) {
                console.log('The game state changed.');
                console.log('You ' + (err.data.win ? 'won!' : 'lost!'));
                // return gameModalService
                //     .message(err.data);
            } else if (err.status) {
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
                startingCoords.splice(index, 1);
                $scope.playerBoard[row][col] = '';
            } else if (startingCoords.length < 10) {
                startingCoords.push(coords);
                $scope.playerBoard[row][col] = 'S';
            }
        };

        vm.requestCpuMove = function() {
            return gameService.cpuMove()
                .then(_setPlayerTurn)
                .then(function(data) {
                    vm.win = data.win;
                    _applyResultToBoard('playerBoard', data.row, data.col, data.result);
                    if (_.isBoolean(vm.win) && !vm.win) {
                        throw {
                            data: "lose"
                        };
                    } else {
                        return;
                    }
                }).catch(_handleError);
        }

        function _applyResultToBoard(boardName, row, col, result) {
            _.set($scope, gameService.getPath(boardName, row, col), result);
        }

        vm.move = function(row, col) {
            var coords = gameService.getCoords(row, col);
            _setCpuTurn();
            gameService.move(coords)
                .then(function(data) {
                    vm.win = data.win;
                    _applyResultToBoard('cpuBoard', data.row, data.col, data.result);
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
