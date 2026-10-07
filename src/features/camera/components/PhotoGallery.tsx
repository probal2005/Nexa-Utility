'use client';

import { Download, Trash2 } from 'lucide-react';

import { downloadPhoto } from '@/features/camera/lib/camera';
import type { CapturedPhoto } from '@/features/camera/types';

type Props = {
  photos: CapturedPhoto[];
  onDelete: (id: string) => void;
};

export function PhotoGallery({ photos, onDelete }: Props) {
  if (photos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] px-6 py-12 text-center">
        <p className="text-sm text-zinc-500">
          Captured photos will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          <img
            src={photo.dataUrl}
            alt={`Captured ${new Date(
              photo.createdAt,
            ).toLocaleString()}`}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-black/70 p-2 backdrop-blur-md transition group-hover:translate-y-0">
            <button
              onClick={() =>
                downloadPhoto(
                  photo.dataUrl,
                  `nexa-${photo.id}.jpg`,
                )
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10"
              title="Download"
            >
              <Download size={15} />
            </button>

            <button
              onClick={() => onDelete(photo.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-300 hover:bg-red-500/10"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
