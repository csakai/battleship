(function() {
    var app = angular.module('battleship');
    app.controller('initCtrl', ['$location', '$q', '$scope', 'gameService', initCtrl]);
    function initCtrl($location, $q, $scope, gameService) {
        var coordNames = ['a','b','c','d','e'];
        $scope.gameId = '';
        $scope.cpuBoard = [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];
        $scope.playerBoard = [
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', ''],
            ['', '', '', '', '']
        ];
        $scope.activeGame = false;
        $scope.cBoard = {
            disabled: true
        };
        $scope.pBoard = {
            disabled: false
        };
        $scope.error = false;
        $scope.errMsg = '';
        function _setBoard(data) {
            _.forEach(coordNames, function (key1, index1) {
                _.forEach(coordNames, function(key2, index2) {
                    $scope.cpuBoard[index2][index1] = data.cpuBoard[key2][key1];
                    $scope.playerBoard[index2][index1] = data.playerBoard[key2][key1];
                });
            });
            var boardSet = $scope.playerBoard.toString().match(/[HMS]/);
            if (boardSet) {
                $scope.handleTurnMessages();
            } else if (!$scope.message) {
                _setBoardMessage();
            }
            $scope.pBoard.disabled = boardSet;
            $scope.cBoard.disabled |= !boardSet;
            $scope.gameEnded = !data.active;
            $scope.win = data.win;
            return;
        }

        function _setBoardMessage() {
            $scope.message = "Click on coordinates on your board to place ships";
        }

        $scope.handleTurnMessages = function handleTurnMessages() {
            var newMsg = "It's ";
            newMsg += $scope.cBoard.disabled
             ? "the cpu's turn."
             : "your turn. Click on the CPU's board.";
            $scope.message = newMsg;
        };

        $scope.getGame = function(gameData) {
            var id;
            var func;
            var param;
            if (gameData) {
                func = $q.resolve;
                param = gameData;
            } else {
                func = gameService.getGame;
                param = $scope.gameId;
                id = $scope.gameId;
            }
            func(param)
                .then(function(data) {
                    if (id) {
                        $scope.id = id;
                    } else {
                        $scope.gameId = '';
                    }
                    $scope.message = '';
                    $scope.activeGame = true;
                    $scope.cBoard.disabled = !data.playerTurn;
                    $scope.pBoard.turn = data.playerTurn;
                    $scope.cBoard.turn = !data.playerTurn;
                    return data;
                }).then(_setBoard);
        };

        if ($location.search().id) {
            $scope.gameId = $location.search().id;
            $scope.getGame();
        }
    }
})();
