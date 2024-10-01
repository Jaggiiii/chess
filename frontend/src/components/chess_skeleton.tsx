import Skeleton from '@mui/material/Skeleton'; // Importing Skeleton from Material-UI

export default function ChessSkeleton() {
  const boardSize = 8;
  const squares = Array(boardSize * boardSize).fill(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className='px-3 py-3 text-black font-bold'>Loading....</div>
      <div
        className="grid aspect-square shadow-lg"
        style={{
          width: 'min(60vw, 60vh)',
          gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        }}
      >
        {squares.map((_, index) => {
          const row = Math.floor(index / boardSize);
          const col = index % boardSize;
          const isEven = (row + col) % 2 === 0;

          return (
            <div>
            <div
              key={index}
              className={`aspect-square ${isEven ? 'bg-white' : 'bg-green-500'} flex items-center justify-center`}
            >
              <Skeleton
                variant="circle" // Set variant to 'circle' for circular skeletons
                className={`w-3/4 h-3/4 ${isEven ? 'bg-green-100' : 'bg-green-300'}`} // Keep the background color class for styling
              />
            </div>
            </div>

          );
        })}
      </div>
      
    </div>
  );
}
