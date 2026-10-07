'use client';

import { CameraOff, Loader2 } from 'lucide-react';
import type { RefObject } from 'react';

import type { CameraStatus } from '@/features/camera/types';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: CameraStatus;
  error: string;
};

export function CameraPreview({
  videoRef,
  status,
  error,
}: Props) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-black shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {status !== 'active' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0c10] px-6 text-center">
          {status === 'requesting' ? (
            <>
              <Loader2
                size={32}
                className="mb-4 animate-spin text-white"
              />
              <p className="text-sm font-medium text-white">
                Starting camera...
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Please allow camera access when prompted.
              </p>
            </>
          ) : status === 'error' ? (
            <>
              <CameraOff
                size={34}
                className="mb-4 text-red-400"
              />
              <p className="text-sm font-medium text-white">
                Camera unavailable
              </p>
              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                {error}
              </p>
            </>
          ) : (
            <>
              <CameraOff
                size={34}
                className="mb-4 text-zinc-600"
              />
              <p className="text-sm font-medium text-zinc-300">
                Camera is off
              </p>
              <p className="mt-1 text-xs text-zinc-600">
                Start the camera to begin.
              </p>
            </>
          )}
        </div>
      )}

      {status === 'active' && (
        <>
          <div className="pointer-events-none absolute inset-5 rounded-2xl border border-white/20" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white/50" />
            <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white/50" />
            <div className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/50" />
            <div className="absolute right-0 top-1/2 h-px w-3 -translate-y-1/2 bg-white/50" />
          </div>

          <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            LIVE
          </div>

          <div className="absolute right-5 top-5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] text-zinc-300 backdrop-blur-md">
            {videoRef.current?.videoWidth || 0} ×{' '}
            {videoRef.current?.videoHeight || 0}
          </div>
        </>
      )}
    </div>
  );
}
