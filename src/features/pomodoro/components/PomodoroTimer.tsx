'use client';

import {
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';

import {
  formatTime,
  getModeLabel,
} from '../lib/pomodoro';

import type {
  PomodoroMode,
} from '../types';

type PomodoroTimerProps = {
  mode: PomodoroMode;
  remaining: number;
  progress: number;
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
};

export function PomodoroTimer({
  mode,
  remaining,
  progress,
  isRunning,
  onStart,
  onPause,
  onReset,
}: PomodoroTimerProps) {
  const radius = 118;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) *
      circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[300px] w-[300px]">
        <svg
          viewBox="0 0 300 300"
          className="-rotate-90 h-full w-full"
        >
          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-white/5"
          />

          <circle
            cx="150"
            cy="150"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="text-white transition-all duration-500"
            strokeDasharray={
              circumference
            }
            strokeDashoffset={
              offset
            }
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
            {getModeLabel(mode)}
          </div>

          <div className="mt-2 text-6xl font-bold tracking-tight text-white tabular-nums">
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={
            isRunning
              ? onPause
              : onStart
          }
          className="inline-flex h-12 min-w-32 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          {isRunning ? (
            <>
              <Pause size={17} />
              Pause
            </>
          ) : (
            <>
              <Play size={17} />
              Start
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-400 transition hover:bg-white/[0.07] hover:text-white"
          aria-label="Reset timer"
        >
          <RotateCcw size={17} />
        </button>
      </div>
    </div>
  );
}
