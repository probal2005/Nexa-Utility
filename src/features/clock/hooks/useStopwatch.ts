"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useStopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedRef = useRef(0);

  useEffect(() => {
    if (!running) {
      return;
    }

    startTimeRef.current = Date.now();

    const interval = window.setInterval(() => {
      if (startTimeRef.current === null) {
        return;
      }

      const currentElapsed =
        accumulatedRef.current + (Date.now() - startTimeRef.current);

      setElapsed(currentElapsed);
    }, 50);

    return () => {
      window.clearInterval(interval);

      if (startTimeRef.current !== null) {
        accumulatedRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
    };
  }, [running]);

  const start = useCallback(() => {
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (startTimeRef.current !== null) {
      accumulatedRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }

    setRunning(false);
    setElapsed(accumulatedRef.current);
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    accumulatedRef.current = 0;
    setElapsed(0);
    setRunning(false);
  }, []);

  return {
    elapsed,
    running,
    start,
    pause,
    reset,
  };
}