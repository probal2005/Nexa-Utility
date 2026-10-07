'use client';

import type {
  PomodoroStats,
} from '../types';

type PomodoroStatsProps = {
  stats: PomodoroStats;
};

export function PomodoroStats({
  stats,
}: PomodoroStatsProps) {
  const items = [
    [
      'Focus sessions',
      stats.completedFocusSessions,
    ],
    [
      'Breaks',
      stats.completedBreaks,
    ],
    [
      'Total focus',
      `${Math.round(
        stats.totalFocusMinutes,
      )} min`,
    ],
    [
      'Today',
      `${Math.round(
        stats.todayFocusMinutes,
      )} min`,
    ],
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map(
        ([label, value]) => (
          <div
            key={label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="text-xs uppercase tracking-wider text-zinc-600">
              {label}
            </div>

            <div className="mt-2 text-2xl font-bold text-white">
              {value}
            </div>
          </div>
        ),
      )}
    </section>
  );
}
