'use client';

import {
  Activity,
  AlertCircle,
  Compass as CompassIcon,
  RotateCcw,
} from 'lucide-react';

import {
  formatHeading,
  getDirectionLabel,
} from '../lib/compass';

import type {
  CompassReading,
  CompassStatus,
} from '../types';

type CompassInfoProps = {
  status: CompassStatus;
  reading: CompassReading | null;
  error: string | null;
  onStart: () => void;
  onStop: () => void;
};

export function CompassInfo({
  status,
  reading,
  error,
  onStart,
  onStop,
}: CompassInfoProps) {
  const active =
    status === 'active';

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <CompassIcon size={19} />
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              Current direction
            </p>

            <p className="text-xs text-zinc-600">
              Device orientation sensor
            </p>
          </div>
        </div>

        {reading ? (
          <div>
            <p className="text-4xl font-semibold tracking-tight text-white">
              {formatHeading(
                reading.heading,
              )}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              {reading.direction} ·{' '}
              {getDirectionLabel(
                reading.direction,
              )}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-zinc-500">
            Start the compass and rotate your device
            to determine its heading.
          </p>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />

          <div>
            <p className="text-sm font-medium text-red-200">
              Compass unavailable
            </p>

            <p className="mt-1 text-xs leading-5 text-red-200/60">
              {error}
            </p>
          </div>
        </div>
      )}

      {status === 'unsupported' && (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 text-xs leading-5 text-zinc-500">
          This device or browser does not expose an
          orientation sensor. Try opening Nexa Utility
          on a mobile device.
        </div>
      )}

      {!active ? (
        <button
          type="button"
          onClick={onStart}
          disabled={status === 'requesting'}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-50"
        >
          {status === 'requesting' ? (
            <>
              <Activity className="h-4 w-4 animate-pulse" />
              Starting Compass...
            </>
          ) : (
            <>
              <CompassIcon className="h-4 w-4" />
              Start Compass
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onStop}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          Stop Compass
        </button>
      )}
    </div>
  );
}
