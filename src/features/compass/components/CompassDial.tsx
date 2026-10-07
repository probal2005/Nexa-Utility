'use client';

import {
  Compass,
} from 'lucide-react';

import {
  formatHeading,
  getDirectionLabel,
} from '../lib/compass';

import type {
  CompassDirection,
} from '../types';

type CompassDialProps = {
  heading: number | null;
  direction: CompassDirection | null;
};

export function CompassDial({
  heading,
  direction,
}: CompassDialProps) {
  const rotation =
    heading === null
      ? 0
      : -heading;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.03] shadow-2xl" />

      <div
        className="absolute inset-5 rounded-full border border-white/10 transition-transform duration-150"
        style={{
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <span className="absolute left-1/2 top-5 -translate-x-1/2 text-2xl font-bold text-red-400">
          N
        </span>

        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xl font-semibold text-zinc-300">
          E
        </span>

        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xl font-semibold text-zinc-300">
          S
        </span>

        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-semibold text-zinc-300">
          W
        </span>

        <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2 bg-white/10" />

        <div className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2 -translate-y-1/2 bg-white/10" />
      </div>

      <div className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-zinc-950 shadow-xl">
        <Compass
          size={28}
          className="mb-2 text-blue-400"
        />

        <div className="text-2xl font-bold text-white">
          {formatHeading(heading)}
        </div>

        <div className="text-xs text-zinc-500">
          {getDirectionLabel(direction)}
        </div>
      </div>

      <div className="absolute left-1/2 top-1 h-8 w-1 -translate-x-1/2 rounded-full bg-red-400 shadow-lg" />
    </div>
  );
}
