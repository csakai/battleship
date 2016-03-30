(function() {
    var app = angular.module('battleship');
    app.factory('gameModalService', ['$uibModal', gameModalService]);
    function gameModalService($uibModal) {

        function message(data) {

        }
        return {
            message: message
        };
    }
})
