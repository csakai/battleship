(function() {
    var app = angular.module('battleship', [
        'ngResource',
        'ui.bootstrap'
    ]);
    app.config(["$locationProvider", function($locationProvider) {
        $locationProvider.html5Mode(true);
    }]);
    app.run(function() {
        console.log("app init");
    });

})();
