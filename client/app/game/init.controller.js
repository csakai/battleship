(function() {
    var app = angular.module('battleship');
    app.controller('initCtrl', ['$q', '$scope', 'gameService', initCtrl]);
    function initCtrl($q, $scope, gameService) {
        var coordNames = ['a','b','c','d','e'];
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
        $scope.message = "Click on coordinates on your board to place ships";
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
            }
            $scope.pBoard.disabled = boardSet;
            $scope.cBoard.disabled |= !boardSet;
            $scope.gameEnded = !data.active;
            $scope.win = data.win;
            return;
        }

        $scope.handleTurnMessages = function handleTurnMessages() {
            var newMsg = "It's ";
            newMsg += $scope.cBoard.disabled
             ? "the cpu's turn."
             : "your turn. Click on the CPU's board.";
            $scope.message = newMsg;
        };

        $scope.getGame = function(gameData) {
            var func;
            var param;
            if (gameData) {
                func = $q.resolve;
                param = gameData;
            } else {
                func = gameService.getGame;
                param = $scope.gameId;
            }
            func(param)
                .then(function(data) {
                    $scope.id = $scope.gameId;
                    $scope.activeGame = true;
                    $scope.cBoard.disabled = !data.playerTurn;
                    $scope.pBoard.turn = data.playerTurn;
                    $scope.cBoard.turn = !data.playerTurn;
                    return data;
                }).then(_setBoard);
        };
    }
})();
