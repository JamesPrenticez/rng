import express from 'express';
import WebSocket, { Server } from 'ws';

const app = express();
const port = 5000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

const wss = new Server({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('A new client connected');

  ws.send('Hello, client!');

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
  });

  ws.on('close', () => {
    console.log('A client disconnected');
  });
});
