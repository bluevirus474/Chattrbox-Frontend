var http = require('http');
var fs = require('fs');
var extract = require('./extract');
var wss = require('./websockets-server');
var mime = require('mime');

var mimeSetup = function(filePath, res) {
    mimeType = mime.getType(filePath);
    res.setHeader('Content-Type', mimeType);
};

var handleError = function (err, res) {
    fs.readFile('./app/error.html', function (err, data) {
        mimeSetup('./app/error.html', res);
        res.end(data);
    });
};

var server = http.createServer(function (req, res) {
    console.log('Responding to a request.');

    var filePath=extract(req.url);
    fs.readFile(filePath, function (err, data) {
        if (err) {
            handleError(err, res);
            return;
        } else {
            mimeSetup(filePath, res);
            res.end(data);
        }
    });
});
server.listen(3000);