'use client';

import {
  ArrowLeft,
  FileText,
  Loader2,
  ScanText,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import {
  clearCameraImageForOCR,
  loadCameraImageForOCR,
} from '@/features/integrations/camera-ocr/cameraOcr';

import OCRImageInput from './OCRImageInput';
import OCRResult from './OCRResult';
import { useOCR } from '../hooks/useOCR';

export default function OCRPage() {
  const {
    status,
    progress,
    result,
    error,
    recognize,
    reset,
  } = useOCR();

  const [preview, setPreview] =
    useState<string | null>(null);

  const cameraHandoffProcessed =
    useRef(false);

  useEffect(() => {
    if (cameraHandoffProcessed.current) {
      return;
    }

    cameraHandoffProcessed.current = true;

    const search =
      window.location.search;

    const params =
      new URLSearchParams(search);

    const source =
      params.get('source');

    if (source !== 'camera') {
      return;
    }

    const cameraImage =
      loadCameraImageForOCR();

    if (!cameraImage) {
      return;
    }

    clearCameraImageForOCR();

    setPreview(cameraImage);

    void recognize(cameraImage);

    window.history.replaceState(
      {},
      '',
      '/scanner/ocr',
    );
  }, [recognize]);

  const handleImage = async (
    file: File,
  ) => {
    const url =
      URL.createObjectURL(file);

    setPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }

      return url;
    });

    await recognize(file);
  };

  const handleReset = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    reset();
  };

  const isProcessing =
    status === 'loading' ||
    status === 'recognizing';

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/scanner"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Scanner Hub
        </Link>

        <header className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
            <ScanText className="h-3.5 w-3.5" />
            OCR Scanner
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Extract text from images.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Select an image containing printed or handwritten text
            and Nexa Utility will process it locally in your browser.
          </p>
        </header>

        {!result && (
          <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-white">
                    Select an image
                  </h2>

                  <p className="text-sm text-white/40">
                    JPG, PNG, WebP and other browser-supported images
                  </p>
                </div>
              </div>

              {preview && (
                <div className="mb-5 overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <img
                    src={preview}
                    alt="OCR source preview"
                    className="max-h-[420px] w-full object-contain"
                  />
                </div>
              )}

              <OCRImageInput
                onSelect={handleImage}
                disabled={isProcessing}
              />

              {isProcessing && (
                <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Recognizing text...
                    </div>

                    <span className="text-sm text-white/50">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <Sparkles className="mb-5 h-6 w-6" />

              <h2 className="font-semibold text-white">
                What OCR can do
              </h2>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/50">
                <li>
                  • Extract text from screenshots.
                </li>

                <li>
                  • Read printed documents.
                </li>

                <li>
                  • Convert image text into editable text.
                </li>

                <li>
                  • Copy extracted text instantly.
                </li>

                <li>
                  • Send camera captures directly to OCR.
                </li>

                <li>
                  • Process the image directly in your browser.
                </li>
              </ul>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs leading-5 text-white/40">
                OCR accuracy depends on image quality, lighting,
                font, orientation and handwriting.
              </div>
            </div>
          </section>
        )}

        {result && (
          <OCRResult
            result={result}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
