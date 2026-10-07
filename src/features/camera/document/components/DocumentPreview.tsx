'use client';

import { Camera } from 'lucide-react';

type DocumentPreviewProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  active: boolean;
};

export function DocumentPreview({
  videoRef,
  active,
}: DocumentPreviewProps) {
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl border border-white/10 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {!active && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <Camera className="mx-auto mb-3 h-10 w-10 text-white/50" />

            <p className="text-sm text-white/60">
              Camera is not active
            </p>
          </div>
        </div>
      )}

      {active && (
        <>
          <div className="pointer-events-none absolute inset-5 rounded-2xl border-2 border-white/80" />

          <div className="pointer-events-none absolute left-1/2 top-5 h-3 w-24 -translate-x-1/2 rounded-full bg-white/70" />

          <div className="pointer-events-none absolute bottom-5 left-1/2 h-3 w-24 -translate-x-1/2 rounded-full bg-white/70" />

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-xs text-white backdrop-blur">
            Align document inside the frame
          </div>
        </>
      )}
    </div>
  );
}
