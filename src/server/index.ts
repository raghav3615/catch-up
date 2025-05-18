const { createServer } = require('node:http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./socket');

const httpServer = createServer();
const io = initializeSocket(httpServer);

httpServer.listen(3001, () => {
  console.log('Socket.IO server running on http://localhost:3001');
}); 