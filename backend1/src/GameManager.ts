import { WebSocket } from "ws";
import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager {
    private games: Game[];
    private pendinguser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendinguser = null;
        this.users = [];
    }

    adduser(socket: WebSocket) {
        this.users.push(socket);
        this.addHandler(socket); 
    }

    removeuser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());

            if (message.type === INIT_GAME) {
                if (this.pendinguser) {
                    const game = new Game(this.pendinguser, socket);
                    this.games.push(game);
                    this.pendinguser = null;
                } else {
                    this.pendinguser = socket;
                }
            }

            if (message.type === MOVE) {
                console.log("inside move")
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);

                if (game) {
                    console.log("inside makemove")
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
