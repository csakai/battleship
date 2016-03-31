(function() {
    var app = angular.module('battleship');
    app.controller('gameCtrl', ['$q', '$scope', 'gameService', gameCtrl]);
    function gameCtrl($q, $scope, gameService) {
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
                console.log('You ' + (err.data.win ? 'won!' : 'lost!'));
            } else {
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

        vm.requestCpuMove = function() {
            return gameService.cpuMove()
                .then(_setPlayerTurn)
                .then(_handleBoardOf('player'))
                .catch(_handleError);
        }

        vm.move = function(row, col) {
            var coords = gameService.getCoords(row, col);
            _setCpuTurn();
            gameService.move(coords)
                .then(_handleBoardOf('cpu'))
                .then(vm.requestCpuMove)
                .catch(_handleError);
        }

    }
})();
