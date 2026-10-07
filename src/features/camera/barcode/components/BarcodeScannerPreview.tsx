'use client';

import { ScanLine } from 'lucide-react';

type Props = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  scanning: boolean;
};

export function BarcodeScannerPreview({
  videoRef,
  scanning,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-black">
      <div className="relative aspect-[4/3] w-full bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          className="block h-full w-full bg-black object-cover"
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="relative h-36 w-[78%] max-w-md rounded-2xl border-2 border-white/70">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/20" />

            {scanning && (
              <div className="absolute left-3 right-3 top-1/2 h-px animate-pulse bg-white" />
            )}

            <div className="absolute -left-1 -top-1 h-5 w-5 border-l-2 border-t-2 border-white" />
            <div className="absolute -right-1 -top-1 h-5 w-5 border-r-2 border-t-2 border-white" />
            <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-white" />
          </div>
        </div>

        {!scanning && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs text-zinc-400 backdrop-blur-md">
              Camera is stopped
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs text-zinc-300 backdrop-blur-md">
          <ScanLine size={14} />
          Align barcode inside the frame
        </div>
      </div>
    </div>
  );
}
