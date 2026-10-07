'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { isNexaPermissionEnabled } from '@/features/privacy/lib/access';

import {
  applyDocumentFilter,
  canvasToDataUrl,
  captureVideoFrame,
  downloadDocument,
  isVideoReady,
  waitForVideoReady,
} from '../lib/documentScanner';

import type {
  DocumentFilter,
  DocumentScan,
} from '../types';

type ScannerStatus =
  | 'idle'
  | 'starting'
  | 'ready'
  | 'capturing'
  | 'stopped'
  | 'error';

export function useDocumentScanner() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [status, setStatus] =
    useState<ScannerStatus>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const [scan, setScan] =
    useState<DocumentScan | null>(null);

  const [filter, setFilter] =
    useState<DocumentFilter>('original');

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(
    async () => {
      if (!isNexaPermissionEnabled('camera')) {
        setError(
          'Camera access is disabled in Nexa Utility Privacy Center.',
        );

        setStatus('error');

        return;
      }

      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(
          'Camera access is not supported by this browser.',
        );

        setStatus('error');

        return;
      }

      stopCamera();

      setError(null);
      setStatus('starting');

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: 'environment',
              },
              width: {
                ideal: 1920,
              },
              height: {
                ideal: 1080,
              },
            },
            audio: false,
          });

        streamRef.current = stream;

        const video =
          videoRef.current;

        if (!video) {
          stream
            .getTracks()
            .forEach((track) => {
              track.stop();
            });

          throw new Error(
            'Camera preview is unavailable.',
          );
        }

        video.srcObject = stream;

        await video.play();

        await waitForVideoReady(
          video,
        );

        if (!isVideoReady(video)) {
          throw new Error(
            'Camera preview is not ready yet.',
          );
        }

        setStatus('ready');
      } catch (cameraError) {
        stopCamera();

        console.error(
          'Document scanner camera error:',
          cameraError,
        );

        setError(
          cameraError instanceof Error
            ? cameraError.message
            : 'Unable to start the camera.',
        );

        setStatus('error');
      }
    },
    [stopCamera],
  );

  const capture = useCallback(
    async () => {
      const video =
        videoRef.current;

      if (!video) {
        setError(
          'Camera preview is unavailable.',
        );

        setStatus('error');

        return;
      }

      try {
        setError(null);
        setStatus('capturing');

        const sourceCanvas =
          await captureVideoFrame(
            video,
          );

        const processedCanvas =
          applyDocumentFilter(
            sourceCanvas,
            filter,
          );

        const dataUrl =
          canvasToDataUrl(
            processedCanvas,
          );

        setScan({
          id: crypto.randomUUID(),
          dataUrl,
          filter,
          createdAt: Date.now(),
        });

        stopCamera();

        setStatus('stopped');
      } catch (captureError) {
        console.error(
          'Document capture error:',
          captureError,
        );

        setError(
          captureError instanceof Error
            ? captureError.message
            : 'Unable to capture the document.',
        );

        setStatus('ready');
      }
    },
    [filter, stopCamera],
  );

  const retake = useCallback(
    async () => {
      setScan(null);

      await startCamera();
    },
    [startCamera],
  );

  const clearScan = useCallback(() => {
    setScan(null);
    setError(null);
    setStatus('idle');
  }, []);

  const downloadScan = useCallback(() => {
    if (!scan) {
      return;
    }

    const timestamp =
      new Date(scan.createdAt)
        .toISOString()
        .replace(/[:.]/g, '-');

    downloadDocument(
      scan.dataUrl,
      `nexa-document-${timestamp}.jpg`,
    );
  }, [scan]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  return {
    videoRef,
    status,
    error,
    scan,
    filter,
    setFilter,
    startCamera,
    stopCamera,
    capture,
    retake,
    clearScan,
    downloadScan,
  };
}
