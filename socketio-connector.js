var socket = require('socket.io');

var SocketIO = (function () {
    this.io = null;

    this.configure = function(server) {
        this.io = socket(server);
    }

    return this;
})();

module.exports = SocketIO;