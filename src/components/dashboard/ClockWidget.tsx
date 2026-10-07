'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';

export function ClockWidget() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setTime(new Date());

    update();

    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <div className="h-52 animate-pulse rounded-3xl border border-white/[0.07] bg-white/[0.03]" />
    );
  }

  const timeString = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const seconds = time.toLocaleTimeString([], {
    second: '2-digit',
  });

  const dateString = time.toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/[0.03] blur-2xl" />

      <div className="relative">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Clock3 size={17} />
            <span className="text-xs font-medium">Local Time</span>
          </div>

          <span className="text-xs text-zinc-600">LIVE</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">
            {timeString}
          </span>

          <span className="text-lg text-zinc-500">
            {seconds}
          </span>
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {dateString}
        </p>
      </div>
    </div>
  );
}