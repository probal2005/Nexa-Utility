'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  downloadBlob,
  getPDFPageCount,
  imagesToPDF,
  mergePDFs,
  rotatePDF,
  splitPDF,
} from '../lib/pdf';

import type {
  PDFPageRotation,
} from '../types';

export function usePDFTools() {
  const [
    isProcessing,
    setIsProcessing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const clearError =
    useCallback(() => {
      setError(null);
    }, []);

  const process = useCallback(
    async (
      operation: () => Promise<void>,
    ) => {
      setIsProcessing(true);
      setError(null);

      try {
        await operation();
      } catch (operationError) {
        console.error(
          'PDF operation failed:',
          operationError,
        );

        setError(
          operationError instanceof Error
            ? operationError.message
            : 'Unable to process PDF.',
        );
      } finally {
        setIsProcessing(false);
      }
    },
    [],
  );

  const getPageCount =
    useCallback(
      async (file: File) =>
        getPDFPageCount(file),
      [],
    );

  const merge =
    useCallback(
      async (files: File[]) => {
        await process(async () => {
          const blob =
            await mergePDFs(files);

          downloadBlob(
            blob,
            'nexa-merged.pdf',
          );
        });
      },
      [process],
    );

  const split =
    useCallback(
      async (
        file: File,
        pages: number[],
      ) => {
        await process(async () => {
          const blob =
            await splitPDF(
              file,
              pages,
            );

          downloadBlob(
            blob,
            'nexa-split.pdf',
          );
        });
      },
      [process],
    );

  const rotate =
    useCallback(
      async (
        file: File,
        rotation: PDFPageRotation,
      ) => {
        await process(async () => {
          const blob =
            await rotatePDF(
              file,
              rotation,
            );

          downloadBlob(
            blob,
            'nexa-rotated.pdf',
          );
        });
      },
      [process],
    );

  const convertImages =
    useCallback(
      async (files: File[]) => {
        await process(async () => {
          const blob =
            await imagesToPDF(files);

          downloadBlob(
            blob,
            'nexa-images.pdf',
          );
        });
      },
      [process],
    );

  return {
    isProcessing,
    error,
    clearError,
    getPageCount,
    merge,
    split,
    rotate,
    convertImages,
  };
}
