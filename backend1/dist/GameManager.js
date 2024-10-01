"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendinguser = null;
        this.users = [];
    }
    adduser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeuser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandler(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendinguser) {
                    const game = new Game_1.Game(this.pendinguser, socket);
                    this.games.push(game);
                    this.pendinguser = null;
                }
                else {
                    this.pendinguser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("inside move");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("inside makemove");
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
