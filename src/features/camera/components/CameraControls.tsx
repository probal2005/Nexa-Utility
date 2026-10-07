'use client';

import {
  Camera,
  CircleStop,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import type { CameraStatus, CapturedPhoto } from '@/features/camera/types';

type Props = {
  status: CameraStatus;
  photos: CapturedPhoto[];
  onStart: () => void;
  onStop: () => void;
  onCapture: () => void;
  onToggle: () => void;
  onClearPhotos: () => void;
};

export function CameraControls({
  status,
  photos,
  onStart,
  onStop,
  onCapture,
  onToggle,
  onClearPhotos,
}: Props) {
  const active = status === 'active';

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onToggle}
        disabled={!active}
        title="Switch camera"
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        <RefreshCw size={19} />
      </button>

      <button
        onClick={active ? onCapture : onStart}
        disabled={status === 'requesting'}
        className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-white text-black shadow-xl shadow-black/30 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {active ? (
          <Camera size={25} strokeWidth={2.2} />
        ) : (
          <Camera size={24} />
        )}
      </button>

      <button
        onClick={active ? onStop : onClearPhotos}
        disabled={active ? false : photos.length === 0}
        title={active ? 'Stop camera' : 'Clear photos'}
        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-zinc-400 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
      >
        {active ? <CircleStop size={19} /> : <Trash2 size={19} />}
      </button>
    </div>
  );
}
