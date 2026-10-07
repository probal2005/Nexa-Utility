'use client';

import {
  Compass,
  Square,
} from 'lucide-react';

type CompassControlsProps = {
  listening: boolean;
  onStart: () => void;
  onStop: () => void;
};

export function CompassControls({
  listening,
  onStart,
  onStop,
}: CompassControlsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {!listening ? (
        <button
          type="button"
          onClick={onStart}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <Compass size={17} />
          Start compass
        </button>
      ) : (
        <button
          type="button"
          onClick={onStop}
          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <Square size={16} />
          Stop
        </button>
      )}
    </div>
  );
}
