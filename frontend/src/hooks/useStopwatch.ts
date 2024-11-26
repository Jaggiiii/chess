import { useState, useEffect } from "react";

// Type for the interval ID, which is different in Node.js and the browser
type IntervalId = ReturnType<typeof setInterval> | null;

export function useStopwatch(initialTime: number = 600) {
  const [time, setTime] = useState(initialTime); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: IntervalId = null; // Initialize interval as null

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            if (interval) {
              clearInterval(interval); // Stop the interval when time reaches 0
            }
            setIsRunning(false);
            return 0; // Ensure time doesn't go negative
          }
          return prevTime - 1; // Decrement the time
        });
      }, 1000); // Update every second
    } else if (interval) {
      clearInterval(interval); // Clear the interval if the stopwatch is paused
    }

    return () => {
      if (interval) {
        clearInterval(interval); // Clean up on component unmount or when stopped
      }
    };
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => setTime(initialTime);

  return { time, start, pause, reset, isRunning };
}
