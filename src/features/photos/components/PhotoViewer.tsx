'use client';

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  X,
} from 'lucide-react';

import {
  downloadPhoto,
  formatPhotoDate,
} from '../lib/photos';

import type { Photo } from '../types';

type PhotoViewerProps = {
  photo: Photo;
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export function PhotoViewer({
  photo,
  index,
  total,
  onPrevious,
  onNext,
  onDelete,
  onClose,
}: PhotoViewerProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-xl bg-white/[0.08] p-2.5 text-zinc-300 transition hover:bg-white/[0.14] hover:text-white"
        aria-label="Close viewer"
      >
        <X size={19} />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/[0.08] p-3 text-zinc-300 transition hover:bg-white/[0.14] hover:text-white"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl bg-white/[0.08] p-3 text-zinc-300 transition hover:bg-white/[0.14] hover:text-white"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      <div className="flex max-h-full max-w-5xl flex-col items-center">
        <img
          src={photo.dataUrl}
          alt="Full-size captured photo"
          className="max-h-[75vh] max-w-full rounded-xl object-contain"
        />

        <div className="mt-4 flex items-center gap-4">
          <p className="text-xs text-zinc-600">
            {index + 1} / {total}
          </p>

          <p className="text-xs text-zinc-500">
            {formatPhotoDate(
              photo.createdAt,
            )}
          </p>

          <button
            type="button"
            onClick={() =>
              downloadPhoto(photo)
            }
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.1] hover:text-white"
          >
            <Download size={14} />
            Download
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.05] px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
