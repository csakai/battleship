/*jshint node:true*/
'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    path = require('path'),
    app = express(),
    port = process.env.PORT || 8000,
    routes;

mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/battleship', {
    db: {
        safe: true
    }
});

mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(1);
    }
);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
routes = require('./routes');

app.get('/ping', function(req, res, next) {
    console.log(req.query);
    res.send('pong');
});
app.use("/src", express.static(path.resolve(__dirname + "/../client/app/")));
app.use("/assets", express.static(path.resolve(__dirname + "/../client/assets")));
app.use("/bower_components", express.static(path.resolve(__dirname + "/../bower_components/")));

app.use("/api", routes);
app.use(require('./util/error_handler'));
app.get("/*", function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../client/index.html"));
});
app.listen(port, function() {
    console.log('************************');
    console.log('Battleship server is go');
    console.log('Listening on port ' + port);
});
