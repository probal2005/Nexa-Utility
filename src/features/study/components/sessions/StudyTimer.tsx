'use client';

import {
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import {
  formatTimer,
} from '@/features/study/lib/sessions';
import {
  useStudyTimer,
} from '@/features/study/hooks/useStudyTimer';

type StudyTimerProps = {
  onSessionComplete: (
    subject: string,
    durationMinutes: number,
  ) => void;
};

export function StudyTimer({
  onSessionComplete,
}: StudyTimerProps) {
  const [subject, setSubject] =
    useState('General Study');

  const handleComplete = useCallback(
    (durationMinutes: number) => {
      onSessionComplete(
        subject,
        durationMinutes,
      );
    },
    [onSessionComplete, subject],
  );

  const {
    durationMinutes,
    remainingSeconds,
    status,
    start,
    pause,
    reset,
    setMinutes,
  } = useStudyTimer(25, handleComplete);

  const progress =
    durationMinutes > 0
      ? 1 -
        remainingSeconds /
          (durationMinutes * 60)
      : 0;

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Subject
            </span>

            <input
              type="text"
              value={subject}
              onChange={(event) =>
                setSubject(event.target.value)
              }
              disabled={status === 'running'}
              placeholder="What are you studying?"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-center outline-none focus:border-primary disabled:opacity-60"
            />
          </label>
        </div>

        <div className="relative mt-8 flex h-64 w-64 items-center justify-center rounded-full border-8 border-muted">
          <div
            className="absolute inset-0 rounded-full border-8 border-primary"
            style={{
              clipPath: `inset(0 ${100 - progress * 100}% 0 0)`,
            }}
          />

          <div className="relative text-center">
            <div className="text-5xl font-bold tabular-nums tracking-tight">
              {formatTimer(remainingSeconds)}
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              {status === 'running'
                ? 'Focus mode'
                : status === 'paused'
                  ? 'Paused'
                  : 'Ready'}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {[15, 25, 45, 60].map((minutes) => (
            <button
              key={minutes}
              type="button"
              disabled={status === 'running'}
              onClick={() =>
                setMinutes(minutes)
              }
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                durationMinutes === minutes
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:bg-muted'
              } disabled:opacity-50`}
            >
              {minutes}m
            </button>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {status === 'running' ? (
            <button
              type="button"
              onClick={pause}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <Pause className="h-4 w-4" />
              Pause
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              <Play className="h-4 w-4" />
              {status === 'paused'
                ? 'Resume'
                : 'Start Session'}
            </button>
          )}

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Completing the timer automatically records a study
          session.
        </p>
      </div>
    </section>
  );
}
