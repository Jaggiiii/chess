import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
    public player1: WebSocket;
    public player2: WebSocket;
    private board: Chess;
    private moves: string[];
    private startTime: Date;
    private moveCount=0;

    constructor(player1: WebSocket, player2: WebSocket) {
        this.board = new Chess();
        this.moves = [];
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = new Date();

        // Send the initial game setup to both players
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    makeMove(socket: WebSocket, move: { from: string; to: string }) {
        // validate the type using zod
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            return;
        }

        console.log("no early return");

        try {
            const result = this.board.move(move);
            if (!result) {
                // If the move is invalid
                console.log("invalid  move user ,do correct move")
                socket.send(JSON.stringify({
                    type: "invalid_move",
                    payload: {
                        message: "Invalid move. Please follow chess rules."
                    }
                }));
                return;
            }
        } catch (e) {
            console.log(e);
            return;
        }
        console.log("move successed")

        if (this.board.isGameOver()) {
            // Send game over message to both players
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            return;
        }

        // Send the move to the correct player
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
