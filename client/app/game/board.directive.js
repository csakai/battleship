(function() {
    var app = angular.module('battleship');
    app.directive('board', function() {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                func: '&',
                data: '=',
                clickable: '='
            },
            templateUrl: '/src/game/board_template.html'
        };
    });
})();
