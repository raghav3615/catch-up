import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { initializeSocket } from './src/server/socket.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  initializeSocket(server);

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
}); 