'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Barcode,
  ShieldCheck,
} from 'lucide-react';

import { BarcodeResult } from '@/features/camera/barcode/components/BarcodeResult';
import { BarcodeScannerControls } from '@/features/camera/barcode/components/BarcodeScannerControls';
import { BarcodeScannerPreview } from '@/features/camera/barcode/components/BarcodeScannerPreview';
import { useBarcodeScanner } from '@/features/camera/barcode/hooks/useBarcodeScanner';

export function BarcodeScannerPage() {
  const {
    videoRef,
    status,
    result,
    error,
    startScanner,
    stopScanner,
    resumeScanner,
  } = useBarcodeScanner();

  const scanning = status === 'scanning';

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/camera"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          Camera
        </Link>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
              <Barcode size={21} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Camera Utility
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Barcode Scanner
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-zinc-500">
            Scan product and standard barcodes directly from your device
            camera. Results stay in this session unless you choose to copy
            or open them.
          </p>
        </div>

        <div className="space-y-5">
          <BarcodeScannerPreview
            videoRef={videoRef}
            scanning={scanning}
          />

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm leading-6 text-red-300">
              {error}
            </div>
          )}

          <BarcodeScannerControls
            status={status}
            onStart={() => void startScanner()}
            onStop={stopScanner}
            onResume={() => void resumeScanner()}
          />

          <BarcodeResult result={result} />

          <div className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-zinc-500"
            />

            <div>
              <p className="text-sm font-medium text-zinc-300">
                Camera privacy
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Camera frames are processed locally in your browser.
                Nexa Utility does not upload your camera feed to a
                server for barcode detection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
