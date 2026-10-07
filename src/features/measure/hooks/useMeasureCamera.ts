'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { isNexaPermissionEnabled } from '@/features/privacy/lib/access';

export function useMeasureCamera() {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const [running, setRunning] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current
      ?.getTracks()
      .forEach((track) => {
        track.stop();
      });

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRunning(false);
  }, []);

  const startCamera = useCallback(
    async () => {
      stopCamera();
      setError(null);

      if (!isNexaPermissionEnabled('camera')) {
        setError(
          'Camera access is disabled in Nexa Utility Privacy Center.',
        );

        return;
      }

      if (
        typeof navigator === 'undefined' ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(
          'Camera access is not supported by this browser.',
        );

        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode: {
                  ideal: 'environment',
                },
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
              },
              audio: false,
            },
          );

        streamRef.current = stream;

        if (!videoRef.current) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop(),
            );

          streamRef.current = null;

          setError(
            'Camera preview is unavailable.',
          );

          return;
        }

        videoRef.current.srcObject =
          stream;

        await videoRef.current.play();

        setRunning(true);
      } catch (cameraError) {
        console.error(
          'Measure camera error:',
          cameraError,
        );

        setError(
          cameraError instanceof Error
            ? cameraError.message
            : 'Unable to access the camera.',
        );
      }
    },
    [stopCamera],
  );

  useEffect(() => {
    return () => {
      streamRef.current
        ?.getTracks()
        .forEach((track) => {
          track.stop();
        });
    };
  }, []);

  return {
    videoRef,
    running,
    error,
    startCamera,
    stopCamera,
  };
}
