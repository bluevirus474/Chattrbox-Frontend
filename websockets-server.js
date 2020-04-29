var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3001;
var ws = new WebSocketServer({
    port: port
});

var messages = [];
var command = new RegExp('/topic ');
var topic = '*** \'Topic is Anything\'';
console.log('websockets server started');

var useCommands = false;

isCommand = function(socket, data) {
    if (command.test(data)) {
        var temp = data;
        temp = temp.replace('/topic ', '')
        topic = '*** \'Topic is ' + temp + '\'';
        socket.send('*** Topic has changed to \'' + temp + '\'');
    }
    return
}

ws.on('connection', function (socket) {
    console.log('client connection established');
    if (useCommands) {
        socket.send(topic);
    }
    messages.forEach(function (msg) {
        socket.send(msg);
    })

    socket.on('message', function (data) {
        console.log('message recieved: ' + data);
        messages.push(data);

        ws.clients.forEach(function (clientSocket) {
            clientSocket.send(data);
            if (useCommands) {
                isCommand(clientSocket, data);
            }
        });
    });
});