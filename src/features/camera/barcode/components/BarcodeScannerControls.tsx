'use client';

import {
  Camera,
  RotateCcw,
  Square,
} from 'lucide-react';

type Props = {
  status: string;
  onStart: () => void;
  onStop: () => void;
  onResume: () => void;
};

export function BarcodeScannerControls({
  status,
  onStart,
  onStop,
  onResume,
}: Props) {
  if (status === 'idle') {
    return (
      <button
        onClick={onStart}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        <Camera size={17} />
        Start Scanner
      </button>
    );
  }

  if (status === 'starting') {
    return (
      <button
        disabled
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 text-sm font-medium text-zinc-500"
      >
        <Camera size={17} />
        Starting camera...
      </button>
    );
  }

  if (status === 'paused') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onResume}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <RotateCcw size={17} />
          Scan Again
        </button>

        <button
          onClick={onStop}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
        >
          <Square size={15} />
          Close
        </button>
      </div>
    );
  }

  if (status === 'scanning') {
    return (
      <button
        onClick={onStop}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-sm font-medium text-zinc-300 transition hover:bg-white/[0.06] hover:text-white"
      >
        <Square size={15} />
        Stop Scanner
      </button>
    );
  }

  return (
    <button
      onClick={onStart}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-semibold text-black transition hover:bg-zinc-200"
    >
      <RotateCcw size={17} />
      Try Again
    </button>
  );
}
