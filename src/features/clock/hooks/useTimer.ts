"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer(initialSeconds = 300) {
  const [duration, setDuration] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const endTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running || endTimeRef.current === null) {
      return;
    }

    const interval = window.setInterval(() => {
      const difference = endTimeRef.current! - Date.now();
      const secondsLeft = Math.max(0, Math.ceil(difference / 1000));

      setRemaining(secondsLeft);

      if (secondsLeft <= 0) {
        setRunning(false);
        setCompleted(true);
        endTimeRef.current = null;
      }
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [running]);

  const start = useCallback(() => {
    if (remaining <= 0) {
      return;
    }

    setCompleted(false);
    endTimeRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  }, [remaining]);

  const pause = useCallback(() => {
    if (endTimeRef.current !== null) {
      const difference = Math.max(
        0,
        endTimeRef.current - Date.now(),
      );

      setRemaining(Math.ceil(difference / 1000));
    }

    endTimeRef.current = null;
    setRunning(false);
  }, []);

  const reset = useCallback(
    (seconds = duration) => {
      endTimeRef.current = null;
      setDuration(seconds);
      setRemaining(seconds);
      setRunning(false);
      setCompleted(false);
    },
    [duration],
  );

  const setTimer = useCallback((seconds: number) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));

    endTimeRef.current = null;
    setDuration(safeSeconds);
    setRemaining(safeSeconds);
    setRunning(false);
    setCompleted(false);
  }, []);

  return {
    duration,
    remaining,
    running,
    completed,
    start,
    pause,
    reset,
    setTimer,
  };
}