"use client";

import Link from "next/link";
import {
  ArrowRight,
  Barcode,
  Camera,
  FileScan,
  Lock,
  QrCode,
  ScanText,
} from "lucide-react";
import type { ScannerTool } from "../types";

type ScannerCardProps = {
  tool: ScannerTool;
};

const iconMap = {
  qr: QrCode,
  barcode: Barcode,
  document: FileScan,
  camera: Camera,
  ocr: ScanText,
};

export default function ScannerCard({ tool }: ScannerCardProps) {
  const Icon = iconMap[tool.icon];

  if (!tool.available) {
    return (
      <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 opacity-65">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
            <Icon className="h-6 w-6" />
          </div>

          <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50">
            <Lock className="h-3 w-3" />
            Coming soon
          </span>
        </div>

        <h3 className="text-lg font-semibold text-white">{tool.title}</h3>

        <p className="mt-2 min-h-10 text-sm leading-5 text-white/50">
          {tool.description}
        </p>
      </div>
    );
  }

  return (
    <Link
      href={tool.href}
      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06] transition group-hover:bg-white/10">
          <Icon className="h-6 w-6" />
        </div>

        <ArrowRight className="h-5 w-5 text-white/30 transition group-hover:translate-x-1 group-hover:text-white/70" />
      </div>

      <h3 className="text-lg font-semibold text-white">{tool.title}</h3>

      <p className="mt-2 min-h-10 text-sm leading-5 text-white/50">
        {tool.description}
      </p>

      <div className="mt-5 text-sm font-medium text-white/70">
        Open scanner
      </div>
    </Link>
  );
}
