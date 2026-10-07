'use client';

import {
  Download,
  Trash2,
} from 'lucide-react';

import {
  formatPhotoDate,
  downloadPhoto,
} from '../lib/photos';

import type { Photo } from '../types';

type PhotoGridProps = {
  photos: Photo[];
  onOpen: (photo: Photo) => void;
  onDelete: (id: string) => void;
};

export function PhotoGrid({
  photos,
  onOpen,
  onDelete,
}: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-400">
          No photos found
        </p>

        <p className="mt-2 text-xs text-zinc-700">
          Capture a photo from Camera and it will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
        >
          <button
            type="button"
            onClick={() => onOpen(photo)}
            className="relative block aspect-square w-full overflow-hidden bg-black"
          >
            <img
              src={photo.dataUrl}
              alt="Captured photo"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-10 text-left opacity-0 transition group-hover:opacity-100">
              <p className="text-[10px] text-zinc-300">
                {formatPhotoDate(
                  photo.createdAt,
                )}
              </p>
            </div>
          </button>

          <div className="flex items-center justify-between border-t border-white/[0.06] px-3 py-2">
            <p className="truncate text-[10px] text-zinc-600">
              {formatPhotoDate(
                photo.createdAt,
              )}
            </p>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  downloadPhoto(photo)
                }
                className="rounded-lg p-1.5 text-zinc-600 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Download photo"
              >
                <Download size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(photo.id)
                }
                className="rounded-lg p-1.5 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete photo"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
