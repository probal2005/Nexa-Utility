'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Barcode,
  Camera,
  Check,
  FileScan,
  Images,
  QrCode,
  ScanText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { CameraControls } from '@/features/camera/components/CameraControls';
import { CameraPreview } from '@/features/camera/components/CameraPreview';
import { PhotoGallery } from '@/features/camera/components/PhotoGallery';
import { useCamera } from '@/features/camera/hooks/useCamera';
import { saveCameraImageForOCR } from '@/features/integrations/camera-ocr/cameraOcr';

const cameraTools = [
  {
    href: '/camera/qr',
    label: 'QR scanner',
    description: 'Read links and details from a QR code.',
    icon: QrCode,
    accent: 'text-violet-300 bg-violet-400/10',
  },
  {
    href: '/camera/barcode',
    label: 'Barcode scanner',
    description: 'Identify products and standard barcodes.',
    icon: Barcode,
    accent: 'text-cyan-300 bg-cyan-400/10',
  },
  {
    href: '/camera/document',
    label: 'Document scanner',
    description: 'Capture clean, readable document scans.',
    icon: FileScan,
    accent: 'text-amber-300 bg-amber-400/10',
  },
];

export function CameraPage() {
  const router = useRouter();

  const {
    videoRef,
    status,
    error,
    photos,
    startCamera,
    stopCamera,
    toggleCamera,
    capturePhoto,
    deletePhoto,
    clearPhotos,
  } = useCamera();

  const active = status === 'active';

  const handleCaptureForOCR = () => {
    const photo = capturePhoto();

    if (!photo) {
      return;
    }

    const saved = saveCameraImageForOCR(photo.dataUrl);

    if (!saved) {
      return;
    }

    stopCamera();
    router.push('/scanner/ocr?source=camera');
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="relative isolate overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.04] to-transparent px-6 py-7 sm:px-9 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-cyan-400/[0.09] blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-10rem] right-1/3 -z-10 h-64 w-64 rounded-full bg-violet-500/[0.08] blur-3xl" />

        <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-medium text-cyan-200">
              <Sparkles size={14} />
              Camera studio
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Make the moment yours.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
              Capture a photo, scan a document, or read a code. Everything stays on this device.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-2xl border border-white/10 bg-black/20 px-4 py-3 sm:self-auto">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-emerald-400/10 text-emerald-300' : 'bg-white/[0.06] text-zinc-400'}`}>
              {active ? <Check size={17} /> : <Camera size={17} />}
            </span>
            <div>
              <p className="text-sm font-medium text-white">{active ? 'Camera is ready' : status === 'requesting' ? 'Connecting…' : status === 'error' ? 'Camera needs attention' : 'Ready when you are'}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{photos.length} {photos.length === 1 ? 'capture' : 'captures'} saved here</p>
            </div>
          </div>
        </div>
      </header>

      <section aria-labelledby="studio-heading" className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111216] shadow-2xl shadow-black/20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
            <div>
              <h2 id="studio-heading" className="text-sm font-semibold text-white">Live view</h2>
              <p className="mt-1 text-xs text-zinc-500">Frame your shot and capture it instantly</p>
            </div>
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium ${active ? 'border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200' : status === 'error' ? 'border-rose-300/20 bg-rose-300/[0.08] text-rose-200' : 'border-white/10 bg-white/[0.04] text-zinc-400'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-emerald-300' : status === 'error' ? 'bg-rose-300' : 'bg-zinc-500'}`} />
              {active ? 'LIVE' : status === 'requesting' ? 'STARTING' : status === 'error' ? 'UNAVAILABLE' : 'OFF'}
            </span>
          </div>

          <div className="p-3 sm:p-5">
            <CameraPreview videoRef={videoRef} status={status} error={error} />
          </div>

          <div className="border-t border-white/[0.07] px-5 py-5 sm:px-6">
            <CameraControls
              status={status}
              photos={photos}
              onStart={() => startCamera()}
              onStop={stopCamera}
              onCapture={capturePhoto}
              onToggle={toggleCamera}
              onClearPhotos={clearPhotos}
            />
            <p className="mt-3 text-center text-xs text-zinc-500">
              {active ? 'Tap the shutter to save a photo' : 'Your camera only turns on when you start it'}
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300"><ShieldCheck size={19} /></span>
              <div>
                <h2 className="text-sm font-semibold text-white">Private by design</h2>
                <p className="mt-1 text-xs text-zinc-500">Processed on this device</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              Camera access starts only when you choose. Photos are stored locally in your browser and are never uploaded by this tool.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-white"><Images size={16} className="text-zinc-400" /> Your captures</div>
              <span className="rounded-full bg-white/[0.07] px-2.5 py-1 text-xs tabular-nums text-zinc-300">{photos.length} / 20</span>
            </div>
            <p className="text-sm leading-6 text-zinc-500">Your latest 20 photos stay available in the library below.</p>
            <a href="#recent-captures" className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-zinc-300 transition hover:text-white">
              View photo library <ArrowRight size={14} />
            </a>
          </div>

          {photos.length > 0 && (
            <div className="rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/[0.045] p-5 sm:p-6">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white"><ScanText size={16} className="text-cyan-200" /> Extract text</div>
              <p className="mb-4 text-sm leading-6 text-zinc-400">Point at a receipt, page, or label and send the frame to OCR.</p>
              <button
                type="button"
                onClick={handleCaptureForOCR}
                disabled={!active}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-200 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ScanText size={16} /> Capture and extract
              </button>
              {!active && <p className="mt-2 text-center text-xs text-zinc-500">Start the camera to capture a frame</p>}
            </div>
          )}
        </aside>
      </section>

      <section aria-labelledby="tools-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">More ways to use your camera</p>
            <h2 id="tools-heading" className="mt-1 text-lg font-semibold text-white">Camera tools</h2>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {cameraTools.map(({ href, label, description, icon: Icon, accent }) => (
            <Link key={href} href={href} className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.05]">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent}`}><Icon size={20} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-white">{label}</span>
                <span className="mt-1 block text-xs leading-5 text-zinc-500">{description}</span>
              </span>
              <ArrowRight size={16} className="shrink-0 text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-zinc-300" />
            </Link>
          ))}
        </div>
      </section>

      <section id="recent-captures" aria-labelledby="captures-heading" className="scroll-mt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">Stored on this device</p>
            <h2 id="captures-heading" className="mt-1 text-lg font-semibold text-white">Recent captures</h2>
          </div>
          {photos.length > 0 && (
            <button type="button" onClick={clearPhotos} className="rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 transition hover:bg-rose-400/10 hover:text-rose-300">
              Clear all photos
            </button>
          )}
        </div>
        <PhotoGallery photos={photos} onDelete={deletePhoto} />
      </section>
    </main>
  );
}
