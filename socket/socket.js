let io; // socket

// exporting functions
module.exports = {
  // intializing socket
  init(server) {
    // eslint-disable-next-line global-require
    io = require('socket.io')(server);
    return io;
  },
  // returing socket
  getIO() {
    return io;
  },
};
