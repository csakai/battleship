(function() {
    var app = angular.module('battleship');
    app.controller('gameCtrl', ['$q', '$scope', '$timeout', 'gameService', gameCtrl]);
    function gameCtrl($q, $scope, $timeout, gameService) {
        var vm = this;
        var startingCoords = [];

        vm.dismissError = function dismissError() {
            $scope.error = false;
            $scope.errMsg = '';
        };

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
                $scope.error = true;
                $scope.errMsg = "Please add " + (10 - startingCoords.length) + " more ships.";
                return;
            }
            gameService.setBoard(startingCoords)
                .then($scope.getGame);
        };

        function _setTurn(data) {
            $scope.cBoard.disabled = !data.playerTurn;
            $scope.cBoard.turn = !data.playerTurn;
            $scope.pBoard.turn = data.playerTurn;
            return data;
        }

        function _handleError(err) {
            // var modal = /*placeholder*/
            if (!err.status) {
                $scope.cBoard.disabled = true;
                $scope.gameEnded = true;
            } else {
                vm.errMsg = err.data;
                vm.error = true;
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

        function _applyResultToBoard(boardName, row, col, result) {
            _.set($scope, gameService.getPath(boardName, row, col), result);
        }

        function _handleBoardOf(name) {
            return function handleTurn(data) {
                _applyResultToBoard(name+'Board', data.row, data.col, data.result);
                if (!data.active) {
                    $scope.win = data.win;
                    return $q.reject({
                        data: {
                            win: data.win
                        }
                    });
                } else {
                    return;
                }
            }
        }

        function _delayCpuMoveRequest() {
            return $timeout(vm.requestCpuMove, 1000);
        }

        vm.requestCpuMove = function() {
            return gameService.cpuMove()
                .then(_setTurn)
                .then(_handleBoardOf('player'))
                .catch(_handleError);
        }

        vm.move = function(row, col) {
            var coords = gameService.getCoords(row, col);
            _setTurn({playerTurn: false});
            gameService.move(coords)
                .then(_handleBoardOf('cpu'))
                .then(_delayCpuMoveRequest)
                .catch(_handleError);
        }

    }
})();
