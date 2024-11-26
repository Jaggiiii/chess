import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";


const getPieceImagePath = (type: PieceSymbol, color: Color): string => {
    const colorPrefix = color === 'w' ? 'w' : 'b'; // 'w' for white, 'b' for black
    const pieceType = type === 'k' ? 'k' : 
                     type === 'q' ? 'q' : 
                     type === 'r' ? 'r' : 
                     type === 'b' ? 'b' : 
                     type === 'n' ? 'n' : 
                     type === 'p' ? 'p' : '';

    return `/${colorPrefix}${pieceType}.png`;  
};

export const ChessBoard = ({ chess, board, socket, setBoard }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null | Square>(null);

    return (
        <div className="text-slate-900">
            {board.map((row, i) => {
                return (
                    <div key={i} className="flex">
                        {row.map((square, j) => {
                            const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;

                            return (
                                <div
                                    onClick={() => {
                                        if (!from) {
                                            setFrom(squareRepresentation);
                                        } else {
                                            setTo(squareRepresentation);

                                            socket.send(JSON.stringify({
                                                type: "move",  // Adjust as needed
                                                payload: {
                                                    move: {
                                                        from,
                                                        to: squareRepresentation  
                                                    }
                                                }
                                            }));

                                            chess.move({ from, to: squareRepresentation });
                                            setBoard(chess.board());

                                            setFrom(null);
                                            setTo(null);
                                            console.log({ from, to: squareRepresentation });
                                        }
                                    }}
                                    key={j}
                                    className={`w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' : 'bg-white'}`}
                                >
                                    <div className="w-full flex justify-center h-full">
                                        <div className="h-full justify-center flex flex-col">
                                            {
                                                // Render piece image if square has a piece
                                                square ? (
                                                    <img
                                                        src={getPieceImagePath(square.type, square.color)}
                                                        alt={`${square.color} ${square.type}`}
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};
