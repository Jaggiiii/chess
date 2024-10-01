import WebSocket, { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';

const wss = new WebSocketServer({ port: 8080 });

const gamemanager = new GameManager();

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    gamemanager.adduser(ws);

    ws.on('disconnect', () => gamemanager.removeuser(ws));
});
