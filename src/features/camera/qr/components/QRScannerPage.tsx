'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

import { QRScannerControls } from '@/features/camera/qr/components/QRScannerControls';
import { QRScannerPreview } from '@/features/camera/qr/components/QRScannerPreview';
import { QRResult } from '@/features/camera/qr/components/QRResult';
import { useQRScanner } from '@/features/camera/qr/hooks/useQRScanner';

export function QRScannerPage() {
  const {
    videoRef,
    canvasRef,
    status,
    result,
    error,
    startScanner,
    stopScanner,
    scanAgain,
    switchCamera,
    isUrl,
  } = useQRScanner();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8">
        <Link
          href="/camera"
          className="mb-5 inline-flex items-center gap-2 text-xs text-zinc-600 transition hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Camera
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
            <QrCode size={19} />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              Camera
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-white">
              QR Scanner
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Scan QR codes instantly using your device camera.
          Detection happens locally in your browser.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <QRScannerPreview
            videoRef={videoRef}
            status={status}
            error={error}
          />

          <canvas
            ref={canvasRef}
            className="hidden"
          />

          <div className="mt-5">
            <QRScannerControls
              status={status}
              onStart={() => startScanner()}
              onStop={stopScanner}
              onSwitch={switchCamera}
            />
          </div>

          {result && (
            <div className="mt-6">
              <QRResult
                result={result}
                isUrl={isUrl(result.data)}
                onScanAgain={scanAgain}
              />
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-sm font-medium text-white">
                  Private scanning
                </p>

                <p className="text-xs text-zinc-600">
                  Processed locally
                </p>
              </div>
            </div>

            <p className="text-xs leading-5 text-zinc-500">
              QR detection runs directly in your browser. The
              scanned content is not sent to a Nexa server.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-zinc-600">
              Supported
            </p>

            <div className="space-y-2 text-xs text-zinc-400">
              <p>✓ Website URLs</p>
              <p>✓ Plain text</p>
              <p>✓ Contact / encoded data</p>
              <p>✓ Wi-Fi QR content</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
