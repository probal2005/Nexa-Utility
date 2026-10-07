'use client';

import Link from 'next/link';
import {
  Camera,
  Images,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { PhotoGrid } from './PhotoGrid';
import { PhotoViewer } from './PhotoViewer';
import { usePhotos } from '../hooks/usePhotos';

import type { Photo } from '../types';

export function PhotosPage() {
  const {
    photos,
    filteredPhotos,
    search,
    setSearch,
    sort,
    setSort,
    removePhoto,
    clearPhotos,
  } = usePhotos();

  const [selectedPhoto, setSelectedPhoto] =
    useState<Photo | null>(null);

  const selectedIndex =
    selectedPhoto
      ? filteredPhotos.findIndex(
          (photo) =>
            photo.id ===
            selectedPhoto.id,
        )
      : -1;

  const openPhoto = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closeViewer = () => {
    setSelectedPhoto(null);
  };

  const previousPhoto = () => {
    if (
      selectedIndex < 0 ||
      filteredPhotos.length <= 1
    ) {
      return;
    }

    const index =
      selectedIndex === 0
        ? filteredPhotos.length - 1
        : selectedIndex - 1;

    setSelectedPhoto(
      filteredPhotos[index],
    );
  };

  const nextPhoto = () => {
    if (
      selectedIndex < 0 ||
      filteredPhotos.length <= 1
    ) {
      return;
    }

    const index =
      selectedIndex ===
      filteredPhotos.length - 1
        ? 0
        : selectedIndex + 1;

    setSelectedPhoto(
      filteredPhotos[index],
    );
  };

  const deleteSelected = () => {
    if (!selectedPhoto) {
      return;
    }

    const currentIndex =
      selectedIndex;

    removePhoto(
      selectedPhoto.id,
    );

    const remaining =
      filteredPhotos.filter(
        (photo) =>
          photo.id !==
          selectedPhoto.id,
      );

    if (remaining.length === 0) {
      setSelectedPhoto(null);
      return;
    }

    const nextIndex = Math.min(
      currentIndex,
      remaining.length - 1,
    );

    setSelectedPhoto(
      remaining[nextIndex],
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
              <Images size={19} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
                Media
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-white">
                Photos
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-zinc-500">
            Browse and manage photos captured with
            Nexa Utility.
          </p>
        </div>

        <Link
          href="/camera"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-medium text-black transition hover:bg-zinc-200"
        >
          <Camera size={15} />
          Open Camera
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-700"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search photos..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-700 focus:border-white/[0.15]"
          />
        </div>

        <select
          value={sort}
          onChange={(event) =>
            setSort(
              event.target.value as
                | 'newest'
                | 'oldest',
            )
          }
          className="rounded-xl border border-white/[0.08] bg-[#111217] px-3 py-2.5 text-xs text-zinc-300 outline-none"
        >
          <option value="newest">
            Newest first
          </option>

          <option value="oldest">
            Oldest first
          </option>
        </select>

        {photos.length > 0 && (
          <button
            type="button"
            onClick={clearPhotos}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/10 bg-red-500/[0.04] px-4 py-2.5 text-xs text-red-400 transition hover:bg-red-500/[0.08]"
          >
            <Trash2 size={14} />
            Clear all
          </button>
        )}
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-300">
            {filteredPhotos.length}{' '}
            {filteredPhotos.length === 1
              ? 'photo'
              : 'photos'}
          </p>

          <p className="mt-1 text-xs text-zinc-700">
            Stored locally in your browser
          </p>
        </div>
      </div>

      <PhotoGrid
        photos={filteredPhotos}
        onOpen={openPhoto}
        onDelete={removePhoto}
      />

      {selectedPhoto && (
        <PhotoViewer
          photo={selectedPhoto}
          index={selectedIndex}
          total={filteredPhotos.length}
          onPrevious={previousPhoto}
          onNext={nextPhoto}
          onDelete={deleteSelected}
          onClose={closeViewer}
        />
      )}
    </div>
  );
}
