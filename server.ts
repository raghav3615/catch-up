import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { initializeSocket } from './src/server/socket.js';
import os from 'node:os';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Function to get local IP address
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip over non-IPv4 and internal (loopback) addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '0.0.0.0'; // Fallback
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  initializeSocket(server);

  const ip = getLocalIp();
  const port = 3000;
  
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
    console.log(`> Ready on http://${ip}:${port}`);
  });
});