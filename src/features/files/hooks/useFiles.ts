'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  deleteFile,
  clearFiles,
  getAllFiles,
  saveFiles,
} from '../lib/database';

import {
  getFileCategory,
  matchesFileSearch,
  sortFiles,
} from '../lib/files';

import type {
  FileCategory,
  FileSort,
  StoredFile,
} from '../types';

export function useFiles() {
  const [files, setFiles] =
    useState<StoredFile[]>([]);

  const [search, setSearch] =
    useState('');

  const [category, setCategory] =
    useState<FileCategory | 'all'>(
      'all',
    );

  const [sort, setSort] =
    useState<FileSort>('newest');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(
    async () => {
      try {
        setLoading(true);

        const stored =
          await getAllFiles();

        setFiles(stored);
        setError(null);
      } catch (refreshError) {
        console.error(
          'Unable to load files:',
          refreshError,
        );

        setError(
          'Unable to load your local files.',
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addFiles = useCallback(
    async (
      selectedFiles:
        | FileList
        | File[],
    ) => {
      const incoming =
        Array.from(selectedFiles);

      if (incoming.length === 0) {
        return;
      }

      try {
        const now = Date.now();

        const storedFiles: StoredFile[] =
          incoming.map((file) => ({
            id: crypto.randomUUID(),
            name: file.name,
            type:
              file.type ||
              'application/octet-stream',
            category:
              getFileCategory(
                file.type,
                file.name,
              ),
            size: file.size,
            createdAt: now,
            updatedAt: now,
            blob: file,
          }));

        await saveFiles(
          storedFiles,
        );

        setFiles((previous) => [
          ...previous,
          ...storedFiles,
        ]);

        setError(null);
      } catch (addError) {
        console.error(
          'Unable to save files:',
          addError,
        );

        setError(
          'Unable to save the selected files locally.',
        );
      }
    },
    [],
  );

  const removeFile = useCallback(
    async (id: string) => {
      try {
        await deleteFile(id);

        setFiles((previous) =>
          previous.filter(
            (file) => file.id !== id,
          ),
        );
      } catch (removeError) {
        console.error(
          'Unable to delete file:',
          removeError,
        );

        setError(
          'Unable to delete this file.',
        );
      }
    },
    [],
  );

  const removeAllFiles =
    useCallback(async () => {
      try {
        await clearFiles();

        setFiles([]);
        setError(null);
      } catch (clearError) {
        console.error(
          'Unable to clear files:',
          clearError,
        );

        setError(
          'Unable to clear your files.',
        );
      }
    }, []);

  const filteredFiles =
    useMemo(() => {
      const filtered =
        files.filter((file) => {
          const matchesCategory =
            category === 'all' ||
            file.category === category;

          return (
            matchesCategory &&
            matchesFileSearch(
              file,
              search,
            )
          );
        });

      return sortFiles(
        filtered,
        sort,
      );
    }, [
      files,
      search,
      category,
      sort,
    ]);

  const stats =
    useMemo(() => {
      const totalSize =
        files.reduce(
          (total, file) =>
            total + file.size,
          0,
        );

      const counts =
        files.reduce(
          (result, file) => {
            result[file.category] += 1;
            return result;
          },
          {
            image: 0,
            video: 0,
            audio: 0,
            document: 0,
            archive: 0,
            code: 0,
            other: 0,
          } as Record<
            FileCategory,
            number
          >,
        );

      return {
        total: files.length,
        totalSize,
        counts,
      };
    }, [files]);

  return {
    files,
    filteredFiles,
    search,
    category,
    sort,
    loading,
    error,
    stats,
    setSearch,
    setCategory,
    setSort,
    addFiles,
    removeFile,
    removeAllFiles,
    refresh,
  };
}
