"use client";

import {
  ArrowLeft,
  Camera,
  FileScan,
  QrCode,
  ScanLine,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SCANNER_TOOLS } from "../lib/scanner";
import ScannerCard from "./ScannerCard";

export default function ScannerPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/60">
                <ScanLine className="h-3.5 w-3.5" />
                Scanner Hub
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Scan anything.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
                QR codes, barcodes, documents and camera capture — all in one
                place.
              </p>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                  <Camera className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    Local-first scanning
                  </p>
                  <p className="text-xs text-white/40">
                    Camera data stays on your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <QrCode className="mb-4 h-6 w-6 text-white/70" />
            <p className="text-2xl font-bold text-white">QR</p>
            <p className="mt-1 text-sm text-white/45">
              Fast QR code detection
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <FileScan className="mb-4 h-6 w-6 text-white/70" />
            <p className="text-2xl font-bold text-white">Docs</p>
            <p className="mt-1 text-sm text-white/45">
              Capture physical documents
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <Sparkles className="mb-4 h-6 w-6 text-white/70" />
            <p className="text-2xl font-bold text-white">OCR</p>
            <p className="mt-1 text-sm text-white/45">
              Text extraction coming next
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-white">
              Choose a scanner
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Select the type of scan you want to perform.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCANNER_TOOLS.map((tool) => (
              <ScannerCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <ScanLine className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Scanner roadmap
              </h2>

              <p className="mt-1 text-sm leading-6 text-white/45">
                Nexa Utility will gradually connect scanning with OCR, notes,
                files, PDF tools and AI-powered document understanding.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
