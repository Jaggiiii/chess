'use client'

import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSoket";
import { Chess } from "chess.js";
import ChessTimer from "../components/chesstimer";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [started, setStarted] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [bothPlayersConnected, setBothPlayersConnected] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');

    useEffect(() => {
        setBoard(chess.board());
    }, [chess]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
                case INIT_GAME:
                    if (waiting) {
                        setTimeout(() => {
                            setStarted(true);
                            setWaiting(false);
                            setBothPlayersConnected(true);
                        }, 2000);
                    } else {
                        setStarted(true);
                    }
                    break;
                case MOVE:
                    const move = message.payload;
                    const updatedChess = new Chess(chess.fen());
                    if (updatedChess.move(move)) {
                        setChess(updatedChess);
                    }
                    break;
                case GAME_OVER:
                    alert("Game over!");
                    break;
            }
        };
    }, [socket, waiting, chess]);

    const handlePlayClick = () => {
        if (!socket) return;
        setWaiting(true);
        socket.send(JSON.stringify({ type: INIT_GAME }));
    };

    const handlePlayerSwitch = () => {
        setCurrentPlayer((prev) => (prev === 'player1' ? 'player2' : 'player1'));
    };

    return (
        <div className="h-screen bg-slate-900">
            <div className="justify-center flex">
                <div className="pt-8 max-w-screen-lg w-full">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                        <div className="md:col-span-4 w-full flex justify-center">
                            {socket && (
                                <ChessBoard
                                    chess={chess}
                                    setBoard={setBoard}
                                    socket={socket}
                                    board={board}
                                />
                            )}
                        </div>
                        <div className="md:col-span-2 bg-slate-800 w-full flex justify-center">
                            {!started && waiting && (
                                <div className="flex justify-center items-center space-x-4">
                                    <div className="spinner" />
                                    <p className="text-white text-xl">Waiting for an opponent...</p>
                                </div>
                            )}
                            {bothPlayersConnected && (
                                <div className="flex flex-col justify-center items-center w-full space-y-4">
                                    <ChessTimer
                                        currentPlayer={currentPlayer}
                                        onPlayerSwitch={handlePlayerSwitch}
                                    />
                                </div>
                            )}
                            {!started && !waiting && (
                                <Button onClick={handlePlayClick} label="Play" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
