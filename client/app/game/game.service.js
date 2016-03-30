(function() {
    var app = angular.module('battleship');
    var rootApiUrl = '/api/games/';
    var apiUrl = rootApiUrl + ':id/:path';
    app.factory('gameService', ['$resource', gameService]);
    function gameService($resource) {
        var id;
        var coordNames = ['a','b','c','d','e'];
        var arrayIndicies = {
            a: 0,
            b: 1,
            c: 2,
            d: 3,
            e: 4
        };
        var resource = $resource(apiUrl, {}, {
            newGame: {
                method: 'PUT',
                url: rootApiUrl
            },
            getGames: {
                method: 'GET',
                url: rootApiUrl
            },
            getGame: {
                method: 'GET'
            },
            endGame: {
                method: 'DELETE'
            },
            setBoard: {
                method: 'PUT',
                params: {
                    path: 'ships'
                }
            },
            move: {
                method: 'PUT',
                params: {
                    path: 'move'
                }
            },
            cpuMove: {
                method: 'POST',
                params: {
                    path: 'cpu_move'
                }
            }
        });

        function setIdAndReturnData(data) {
            id = data._id;
            return data;
        }

        this.index = function(status) {
            var reqObj = {};
            if (status === 'active') {
                reqObj.active = true;
            } else {
                reqObj.active = false;
                reqObj.win = ('win' === status);
            }
            return resource.getGames(reqObj).$promise;
        };
        this.newGame = function() {
            return resource
                .newGame()
                .$promise
                .then(setIdAndReturnData);
        };
        this.getGame = function() {
            return resource.getGame({id: id}).$promise;
        };
        this.endGame = function() {
            return resource.endGame({id: id}).$promise;
        };
        this.setBoard = function(coords) {
            return resource
                .setBoard({id: id}, {coords: coords})
                .$promise;
        };
        this.move = function(coords) {
            return resource
                .move({id: id}, {coords: coords})
                .$promise;
        };
        this.cpuMove = function() {
            return resource
                .cpuMove({id: id})
                .$promise;
        };

        this.getArrIndices = function (row, col) {
            return arrayIndices[row] + '.' + arrayIndices[col];
        };

        // this.convertBoard = function(board) {
        //     var boardArr = [];
        //     _.forEach(coordNames, function(key1, index1) {
        //         _.forEach(coordNames, function(key2, index2) {
        //             boardArr[index2][index1] = board[key2][key1];
        //         });
        //     });
        //     return boardArr;
        // };

        this.getCoords = function(row, col) {
            return (coordNames[row] + coordNames[col]);
        };
    }
})();
