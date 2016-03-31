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
        function _setBoard(data) {
            _.forEach(coordNames, function (key1, index1) {
                _.forEach(coordNames, function(key2, index2) {
                    $scope.cpuBoard[index2][index1] = data.cpuBoard[key2][key1];
                    $scope.playerBoard[index2][index1] = data.playerBoard[key2][key1];
                });
            });
            return;
        }
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
                    $scope.pBoard.disabled = true;
                    $scope.cBoard.disabled = !data.playerTurn;
                    return data;
                }).then(_setBoard);
        };
    }
})();
