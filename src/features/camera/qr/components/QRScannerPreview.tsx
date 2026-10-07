'use client';

import {
  CameraOff,
  Loader2,
  QrCode,
} from 'lucide-react';

import type { RefObject } from 'react';

import type { QRScannerStatus } from '@/features/camera/qr/types';

type Props = {
  videoRef: RefObject<HTMLVideoElement | null>;
  status: QRScannerStatus;
  error: string;
};

export function QRScannerPreview({
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

      {status !== 'scanning' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0c10] px-6 text-center">
          {status === 'requesting' ? (
            <>
              <Loader2
                size={32}
                className="mb-4 animate-spin text-white"
              />

              <p className="text-sm font-medium text-white">
                Starting scanner...
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Please allow camera access.
              </p>
            </>
          ) : status === 'error' ? (
            <>
              <CameraOff
                size={34}
                className="mb-4 text-red-400"
              />

              <p className="text-sm font-medium text-white">
                Scanner unavailable
              </p>

              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                {error}
              </p>
            </>
          ) : status === 'detected' ? (
            <>
              <QrCode
                size={38}
                className="mb-4 text-white"
              />

              <p className="text-sm font-medium text-white">
                QR code detected
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Check the result below.
              </p>
            </>
          ) : (
            <>
              <QrCode
                size={38}
                className="mb-4 text-zinc-600"
              />

              <p className="text-sm font-medium text-zinc-300">
                QR Scanner
              </p>

              <p className="mt-1 text-xs text-zinc-600">
                Start scanning to detect a QR code.
              </p>
            </>
          )}
        </div>
      )}

      {status === 'scanning' && (
        <>
          <div className="absolute inset-[15%] rounded-3xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
            <span className="absolute left-0 top-0 h-7 w-7 -translate-x-0.5 -translate-y-0.5 border-l-4 border-t-4 border-white" />

            <span className="absolute right-0 top-0 h-7 w-7 translate-x-0.5 -translate-y-0.5 border-r-4 border-t-4 border-white" />

            <span className="absolute bottom-0 left-0 h-7 w-7 -translate-x-0.5 translate-y-0.5 border-b-4 border-l-4 border-white" />

            <span className="absolute bottom-0 right-0 h-7 w-7 translate-x-0.5 translate-y-0.5 border-b-4 border-r-4 border-white" />

            <div className="absolute left-4 right-4 top-1/2 h-px animate-pulse bg-red-400" />
          </div>

          <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md">
            SCANNING
          </div>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-xs text-zinc-300 backdrop-blur-md">
            Point your camera at a QR code
          </div>
        </>
      )}

      <canvas
        ref={() => undefined}
        className="hidden"
      />
    </div>
  );
}
