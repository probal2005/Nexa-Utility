'use client';

import {
  Bell,
  TimerReset,
} from 'lucide-react';

import {
  usePomodoro,
} from '../hooks/usePomodoro';

import {
  ModeSelector,
} from './ModeSelector';

import {
  PomodoroSettings,
} from './PomodoroSettings';

import {
  PomodoroStats,
} from './PomodoroStats';

import {
  PomodoroTimer,
} from './PomodoroTimer';

export function PomodoroPage() {
  const {
    settings,
    stats,
    mode,
    remaining,
    progress,
    isRunning,
    start,
    pause,
    reset,
    changeMode,
    updateSettings,
  } = usePomodoro();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <TimerReset
              size={23}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Pomodoro
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Focus deeply, take intentional
              breaks, and keep your sessions
              measurable.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <ModeSelector
          mode={mode}
          onChange={changeMode}
        />

        <div className="mt-8">
          <PomodoroTimer
            mode={mode}
            remaining={remaining}
            progress={progress}
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </div>

        <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-center text-xs leading-5 text-zinc-500">
          <Bell size={14} className="shrink-0" />
          Notifications are requested only
          when you start a session.
        </div>
      </section>

      <PomodoroStats stats={stats} />

      <PomodoroSettings
        settings={settings}
        onChange={updateSettings}
      />

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-sm font-semibold text-white">
          Local-first sessions
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Your timer settings and completed
          sessions stay in your browser.
          Cloud synchronization can be added
          later without changing the timer.
        </p>
      </section>
    </main>
  );
}
