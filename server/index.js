/*jshint node:true*/
'use strict';

var config = require('config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    port = process.env.PORT || 8000,
    routes;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./util/error_handler'));
routes = require('./routes');

app.get('/ping', function(req, res, next) {
    console.log(req.query);
    res.send('pong');
});
app.use("/src", express.static(path.resolve(__dirname + "/../client/app/")));
app.use("/assets", express.static(path.resolve(__dirname + "/../client/assets")));
app.use("/bower_components", express.static(path.resolve(__dirname + "/../bower_components/")));

app.use("/api", routes);
app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../client/index.html"));
});
app.listen(port, function() {
    console.log('************************');
    console.log('Battleship server is go');
    console.log('Listening on port ' + port);
});
