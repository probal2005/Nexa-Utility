'use client';

import {
  Camera,
  CircleStop,
  RefreshCw,
} from 'lucide-react';

import type { QRScannerStatus } from '@/features/camera/qr/types';

type Props = {
  status: QRScannerStatus;
  onStart: () => void;
  onStop: () => void;
  onSwitch: () => void;
};

export function QRScannerControls({
  status,
  onStart,
  onStop,
  onSwitch,
}: Props) {
  const scanning =
    status === 'scanning' ||
    status === 'requesting';

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onSwitch}
        disabled={!scanning}
        title="Switch camera"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RefreshCw size={19} />
      </button>

      <button
        onClick={scanning ? onStop : onStart}
        disabled={status === 'requesting'}
        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-white text-black shadow-xl transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {scanning ? (
          <CircleStop size={25} />
        ) : (
          <Camera size={25} />
        )}
      </button>

      <div className="h-12 w-12" />
    </div>
  );
}
