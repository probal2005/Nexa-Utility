'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  startBarcodeScanner,
  type BarcodeScanResult,
} from '../lib/barcodeScanner';

type ScannerStatus =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'stopped'
  | 'error';

export function useBarcodeScanner() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const controlsRef =
    useRef<{
      stop: () => void;
    } | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const lastResultRef =
    useRef<string>('');

  const [result, setResult] =
    useState<BarcodeScanResult | null>(null);

  const [status, setStatus] =
    useState<ScannerStatus>('idle');

  const [error, setError] =
    useState<string | null>(null);

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const stopScannerInternal = useCallback(() => {
    controlsRef.current?.stop();
    controlsRef.current = null;

    stopMediaStream();
  }, [stopMediaStream]);

  const handleResult = useCallback(
    (scanResult: BarcodeScanResult) => {
      if (
        !scanResult.text ||
        scanResult.text === lastResultRef.current
      ) {
        return;
      }

      lastResultRef.current =
        scanResult.text;

      setResult({
        ...scanResult,
        timestamp: Date.now(),
      });

      setStatus('stopped');

      stopScannerInternal();
    },
    [stopScannerInternal],
  );

  const startScanner = useCallback(
    async () => {
      if (!videoRef.current) {
        setError(
          'Camera preview is unavailable.',
        );

        setStatus('error');

        return;
      }

      stopScannerInternal();

      setError(null);
      setResult(null);
      lastResultRef.current = '';

      setStatus('starting');

      try {
        const controls =
          await startBarcodeScanner(
            videoRef.current,
            handleResult,
          );

        /*
         * Keep the stream reference after ZXing has
         * attached to the existing video element.
         */
        const currentStream =
          videoRef.current
            .srcObject instanceof MediaStream
            ? videoRef.current.srcObject
            : null;

        streamRef.current =
          currentStream;

        controlsRef.current =
          controls;

        setStatus('scanning');
      } catch (scanError) {
        console.error(
          'Barcode scanner error:',
          scanError,
        );

        stopMediaStream();

        setError(
          scanError instanceof Error
            ? scanError.message
            : 'Unable to start barcode scanner.',
        );

        setStatus('error');
      }
    },
    [
      handleResult,
      stopMediaStream,
      stopScannerInternal,
    ],
  );

  const stopScanner = useCallback(() => {
    stopScannerInternal();

    setStatus('stopped');
  }, [stopScannerInternal]);

  const resumeScanner = useCallback(
    async () => {
      await startScanner();
    },
    [startScanner],
  );

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
      controlsRef.current = null;

      stopMediaStream();
    };
  }, [stopMediaStream]);

  return {
    videoRef,
    result,
    status,
    error,
    startScanner,
    stopScanner,
    resumeScanner,
  };
}
