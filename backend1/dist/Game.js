"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.board = new chess_js_1.Chess();
        this.moves = [];
        this.player1 = player1;
        this.player2 = player2;
        this.startTime = new Date();
        // Send the initial game setup to both players
        this.player1.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        // Validate turn logic
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            socket.send(JSON.stringify({
                type: "invalid_move",
                payload: {
                    message: "It's not your turn!"
                }
            }));
            return;
        }
        if (this.moveCount % 2 === 1 && socket !== this.player2) {
            socket.send(JSON.stringify({
                type: "invalid_move",
                payload: {
                    message: "It's not your turn!"
                }
            }));
            return;
        }
        console.log("no early return");
        try {
            // Attempt to make the move
            const result = this.board.move(move);
            if (!result) {
                console.log("Invalid move detected");
                socket.send(JSON.stringify({
                    type: "invalid_move",
                    payload: {
                        message: "Invalid move. Please follow chess rules."
                    }
                }));
                return;
            }
        }
        catch (error) {
            console.error("Error making move:", error);
            socket.send(JSON.stringify({
                type: "invalid_move",
                payload: {
                    message: "Error processing the move. Check your input."
                }
            }));
            return;
        }
        console.log("move succeeded");
        // Check for game over
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            this.player2.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? "black" : "white"
                }
            }));
            return;
        }
        // Notify the opponent of the valid move
        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        this.moveCount++;
    }
}
exports.Game = Game;
