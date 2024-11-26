import { useStopwatch } from "../hooks/useStopwatch";
import { useEffect } from "react";

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

interface ChessTimerProps {
  currentPlayer: 'player1' | 'player2'; // Current player's turn
  onPlayerSwitch: () => void; // Function to switch player turns
}

export default function ChessTimer({ currentPlayer, onPlayerSwitch }: ChessTimerProps) {
  const player1 = useStopwatch(600); // Player 1 starts with 10 minutes (600 seconds)
  const player2 = useStopwatch(600); // Player 2 starts with 10 minutes (600 seconds)

  // Handle switching turns between players
  useEffect(() => {
    if (currentPlayer === 'player1') {
      player1.start();
      player2.pause(); // Pause Player 2 when Player 1 is playing
    } else {
      player2.start();
      player1.pause(); // Pause Player 1 when Player 2 is playing
    }
  }, [currentPlayer]); // Re-run when currentPlayer changes

  // Detect timeout for either player
  useEffect(() => {
    if (player1.time === 0) {
      alert("Player 2 (Black) wins! Player 1's time has run out.");
      player1.pause();
      player2.pause();
    } else if (player2.time === 0) {
      alert("Player 1 (White) wins! Player 2's time has run out.");
      player1.pause();
      player2.pause();
    }
  }, [player1.time, player2.time]);

  return (
    <div className="flex flex-col h-[70vh] w-[35vw] border border-gray-300 rounded-lg overflow-hidden shadow-lg">
      {/* Player 1 Timer */}
      <div className="flex-1 flex flex-col items-center justify-center bg-primary/10 p-4">
        <h2 className="text-2xl font-bold mb-2">Player 1 (White)</h2>
        <div className="text-4xl font-mono mb-4">{formatTime(player1.time)}</div>
        <div className="space-x-2">
          <button
            onClick={() => onPlayerSwitch()} // Call onPlayerSwitch to switch turns
            disabled={player1.isRunning || player1.time === 0 || player2.time === 0} // Disable if timer is running or time is out
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
          >
            {player1.isRunning ? 'Running' : 'Start'}
          </button>
        </div>
      </div>

      {/* Player 2 Timer */}
      <div className="flex-1 flex flex-col items-center justify-center bg-secondary/10 p-4">
        <h2 className="text-2xl font-bold mb-2">Player 2 (Black)</h2>
        <div className="text-4xl font-mono mb-4">{formatTime(player2.time)}</div>
        <div className="space-x-2">
          <button
            onClick={() => onPlayerSwitch()} // Call onPlayerSwitch to switch turns
            disabled={player2.isRunning || player1.time === 0 || player2.time === 0} // Disable if timer is running or time is out
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
          >
            {player2.isRunning ? 'Running' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
}
