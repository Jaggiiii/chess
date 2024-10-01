import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: any
    setBoard: any
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket

}) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null | Square>(null);

    return <div className="text-slate-900">
        {
            board.map((row, i) => {
                return <div key={i} className="flex">
                    {
                        row.map((square, j) => {
                            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                            return <div onClick={() => {
                                if (!from) {
                                   
                                    setFrom(squareRepresentation);
                                } else {
                                   
                                    setTo(squareRepresentation);

                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        payload: {
                                            move:{
                                                from,
                                                to: squareRepresentation  
                                            }
                                            
                                        }
                                    }));

                                   
                                    chess.move({
                                        from,
                                        to: squareRepresentation
                                    });

                                    setBoard(chess.board());

                                 
                                    setFrom(null);
                                    setTo(null);

                                    console.log({
                                        from,
                                        to: squareRepresentation
                                    });
                                }
                            }}
                                key={j} className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-white'}`}>
                                <div className="w-full flex justify-center h-full">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? square.type : ""}
                                    </div>
                                </div>
                            </div>
                        })
                    }
                </div>
            })
        }
    </div>
}