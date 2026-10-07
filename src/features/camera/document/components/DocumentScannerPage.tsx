'use client';

import { AlertCircle, ScanLine } from 'lucide-react';

import { DocumentControls } from './DocumentControls';
import { DocumentPreview } from './DocumentPreview';
import { ScanResult } from './ScanResult';

import { useDocumentScanner } from '../hooks/useDocumentScanner';

export function DocumentScannerPage() {
  const {
    videoRef,
    status,
    error,
    scan,
    filter,
    setFilter,
    startCamera,
    stopCamera,
    capture,
    retake,
    clearScan,
    downloadScan,
  } = useDocumentScanner();

  const cameraActive =
    status === 'starting' ||
    status === 'ready' ||
    status === 'capturing';

  const capturing =
    status === 'capturing';

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
              <ScanLine className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Document Scanner
              </h1>

              <p className="text-sm text-white/50">
                Turn your camera into a simple document scanner.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>
              <p className="font-medium">
                Scanner error
              </p>

              <p className="mt-1 text-red-200/70">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section>
            {scan ? (
              <ScanResult
                image={scan.dataUrl}
                onDownload={downloadScan}
                onRetake={retake}
                onClear={clearScan}
              />
            ) : (
              <DocumentPreview
                videoRef={videoRef}
                active={cameraActive}
              />
            )}
          </section>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            {!scan && (
              <>
                <div className="mb-5">
                  <p className="mb-1 text-sm font-medium text-white">
                    Scanner
                  </p>

                  <p className="text-sm leading-6 text-white/50">
                    Place the document inside the frame,
                    keep the camera steady, then capture it.
                  </p>
                </div>

                {!cameraActive && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="mb-5 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-white/90"
                  >
                    Start Camera
                  </button>
                )}

                <DocumentControls
                  filter={filter}
                  onFilterChange={setFilter}
                  onCapture={capture}
                  onStop={stopCamera}
                  active={cameraActive}
                  capturing={capturing}
                />

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-xs leading-5 text-white/40">
                    Your document is processed locally
                    in your browser. Nothing is uploaded
                    to a server.
                  </p>
                </div>
              </>
            )}

            {scan && (
              <div>
                <p className="mb-1 text-sm font-medium text-white">
                  Scan complete
                </p>

                <p className="text-sm leading-6 text-white/50">
                  Your scanned document is ready.
                  Save it to your device or retake it.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
