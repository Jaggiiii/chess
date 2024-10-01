import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSoket";
import { Chess } from "chess.js";
import ChessSkeleton from "../components/chess_skeleton";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

export const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [strated, setStarted] = useState(false);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log("game initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("move initialized");
                    break;
                case GAME_OVER:
                    console.log("game over");
                    alert("game over ")
                    break;
            }
        };
    }, [socket]);

    if (!socket) {
        return  <div> 
           
            <div><ChessSkeleton/></div>
            
        </div>;
    }

    return (
        <div className="h-screen bg-slate-900">
            <div className="justify-center flex">
                <div className="pt-8 max-w-screen-lg w-full">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full">
                        <div className="md:col-span-4 w-full flex justify-center">
                            <ChessBoard
                                chess={chess}
                                setBoard={setBoard}
                                socket={socket}
                                board={board}
                            />
                        </div>

                        <div className="md:col-span-2 bg-slate-800 w-full flex justify-center">
                            {!strated && (
                                <Button
                                    onClick={() => {
                                        console.log("Initializing game");
                                        socket.send(
                                            JSON.stringify({
                                                type: INIT_GAME,
                                            })
                                        );
                                    }}
                                    label="Play"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
