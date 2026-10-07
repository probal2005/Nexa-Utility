'use client';

import {
  FileText,
  ShieldCheck,
} from 'lucide-react';

import {
  useState,
} from 'react';

import {
  usePDFTools,
} from '../hooks/usePDFTools';

import type {
  PDFTool,
} from '../types';

import {
  PDFOperationPanel,
} from './PDFOperationPanel';

import {
  PDFToolSelector,
} from './PDFToolSelector';

export function PDFPage() {
  const [
    tool,
    setTool,
  ] = useState<PDFTool>('merge');

  const {
    isProcessing,
    error,
    merge,
    split,
    rotate,
    convertImages,
  } = usePDFTools();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <FileText
              size={23}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              PDF Tools
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Merge, split, rotate, and create
              PDFs directly inside Nexa Utility.
              Your files stay on your device.
            </p>
          </div>
        </div>
      </section>

      <PDFToolSelector
        tool={tool}
        onChange={setTool}
      />

      <PDFOperationPanel
        tool={tool}
        isProcessing={isProcessing}
        onMerge={merge}
        onSplit={split}
        onRotate={rotate}
        onImagesToPDF={
          convertImages
        }
      />

      {error && (
        <section className="rounded-3xl border border-red-400/20 bg-red-400/5 p-5">
          <div className="text-sm font-medium text-red-300">
            PDF operation failed
          </div>

          <p className="mt-1 text-sm text-red-300/70">
            {error}
          </p>
        </section>
      )}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <ShieldCheck
            size={17}
            className="text-emerald-400"
          />
          Private by default
        </div>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Nexa Utility processes these PDF
          operations in your browser. Your
          selected files are not uploaded to a
          Nexa server.
        </p>
      </section>
    </main>
  );
}
