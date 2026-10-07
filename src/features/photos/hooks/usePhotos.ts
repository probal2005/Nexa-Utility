'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearStoredPhotos,
  deleteStoredPhoto,
  getStoredPhotos,
} from '../lib/photos';

import type {
  Photo,
  PhotoSort,
} from '../types';

export function usePhotos() {
  const [photos, setPhotos] =
    useState<Photo[]>([]);

  const [search, setSearch] =
    useState('');

  const [sort, setSort] =
    useState<PhotoSort>('newest');

  const refresh = useCallback(() => {
    setPhotos(getStoredPhotos());
  }, []);

  useEffect(() => {
    refresh();

    const handleStorage = () => {
      refresh();
    };

    window.addEventListener(
      'storage',
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage,
      );
    };
  }, [refresh]);

  const removePhoto = useCallback(
    (id: string) => {
      setPhotos(
        deleteStoredPhoto(id),
      );
    },
    [],
  );

  const clearPhotos = useCallback(() => {
    clearStoredPhotos();
    setPhotos([]);
  }, []);

  const filteredPhotos =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      const filtered =
        photos.filter((photo) => {
          if (!query) {
            return true;
          }

          return (
            photo.id
              .toLowerCase()
              .includes(query) ||
            photo.createdAt
              .toLowerCase()
              .includes(query)
          );
        });

      return [...filtered].sort(
        (a, b) => {
          const first =
            new Date(
              a.createdAt,
            ).getTime();

          const second =
            new Date(
              b.createdAt,
            ).getTime();

          return sort === 'newest'
            ? second - first
            : first - second;
        },
      );
    }, [
      photos,
      search,
      sort,
    ]);

  return {
    photos,
    filteredPhotos,
    search,
    setSearch,
    sort,
    setSort,
    refresh,
    removePhoto,
    clearPhotos,
  };
}
