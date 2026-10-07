'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export type StudyTimerStatus =
  | 'idle'
  | 'running'
  | 'paused';

export function useStudyTimer(
  initialMinutes = 25,
  onComplete?: (durationMinutes: number) => void,
) {
  const [durationMinutes, setDurationMinutes] =
    useState(initialMinutes);

  const [remainingSeconds, setRemainingSeconds] =
    useState(initialMinutes * 60);

  const [status, setStatus] =
    useState<StudyTimerStatus>('idle');

  const startedAtRef = useRef<number | null>(null);

  const durationRef = useRef(initialMinutes);

  const completedRef = useRef(false);

  useEffect(() => {
    durationRef.current = durationMinutes;
  }, [durationMinutes]);

  useEffect(() => {
    if (status !== 'running') {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);

          setStatus('idle');

          if (!completedRef.current) {
            completedRef.current = true;

            onComplete?.(
              durationRef.current,
            );
          }

          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [status, onComplete]);

  const start = useCallback(() => {
    if (remainingSeconds <= 0) {
      setRemainingSeconds(
        durationMinutes * 60,
      );
    }

    if (startedAtRef.current === null) {
      startedAtRef.current = Date.now();
    }

    completedRef.current = false;
    setStatus('running');
  }, [durationMinutes, remainingSeconds]);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');

    setRemainingSeconds(
      durationMinutes * 60,
    );

    startedAtRef.current = null;
    completedRef.current = false;
  }, [durationMinutes]);

  const setMinutes = useCallback(
    (minutes: number) => {
      const safeMinutes = Math.min(
        180,
        Math.max(1, Math.round(minutes)),
      );

      setDurationMinutes(safeMinutes);

      if (status === 'idle') {
        setRemainingSeconds(
          safeMinutes * 60,
        );
      }
    },
    [status],
  );

  return {
    durationMinutes,
    remainingSeconds,
    status,
    start,
    pause,
    reset,
    setMinutes,
  };
}
