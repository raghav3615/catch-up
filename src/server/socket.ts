import { Server } from 'socket.io';
import { Server as HTTPServer } from 'node:http';
import { Socket } from 'socket.io';

interface SignalData {
  signal: any;
  to: string;
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  const rooms: { [key: string]: string[] } = {};
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push(socket.id);

      // Notify others in the room
      socket.to(roomId).emit('user-joined', socket.id);

      // Handle disconnection
      socket.on('disconnect', () => {
        if (rooms[roomId]) {
          rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
          if (rooms[roomId].length === 0) {
            delete rooms[roomId];
          }
        }
        socket.to(roomId).emit('user-left', socket.id);
      });
    });

    // Handle WebRTC signaling
    socket.on('send-signal', ({ signal, to }: SignalData) => {
      io.to(to).emit('receive-signal', { signal, from: socket.id });
    });
  });

    return io;
};