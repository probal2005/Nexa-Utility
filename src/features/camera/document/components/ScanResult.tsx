'use client';

import {
  Download,
  RotateCcw,
  Trash2,
} from 'lucide-react';

type ScanResultProps = {
  image: string;
  onDownload: () => void;
  onRetake: () => void;
  onClear: () => void;
};

export function ScanResult({
  image,
  onDownload,
  onRetake,
  onClear,
}: ScanResultProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
        <img
          src={image}
          alt="Scanned document"
          className="block h-auto w-full"
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={onRetake}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" />
          Retake
        </button>

        <button
          type="button"
          onClick={onDownload}
          className="flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          <Download className="h-4 w-4" />
          Save
        </button>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-3 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/20"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
