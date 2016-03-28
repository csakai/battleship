(function() {
    var app = angular.module('battleship', [
        'ngResource',
        'ui.bootstrap'
    ]);
    app.run(function() {
        console.log("app init");
    });

})();
