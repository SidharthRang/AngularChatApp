const socketIO = require('socket.io');

function init(server) {
    var io = socketIO(server);
    var room = "";
    io.on('connection', (socket) => {

        socket.on('alertFriends', (user) => {
            socket.join(user.user);
            socket.broadcast.emit('loginAlert', { user: user.user });
        });

        socket.on('startChat', (user) => {
        });

        socket.on('sendMessage', (message) => {
            console.log(message);
            socket.to(message.to).broadcast.emit('receiveMessage', { message: message.message })
        })

        socket.on('disconnect', () => {
        });
    });
}

var socket_io = {
    init: init
}

module.exports = { socket_io };