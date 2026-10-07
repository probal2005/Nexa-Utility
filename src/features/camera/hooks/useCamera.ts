'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { localStorageAdapter } from '@/lib/storage';

import {
  captureVideoFrame,
  isCameraSupported,
  requestCameraStream,
  stopCameraStream,
} from '@/features/camera/lib/camera';
import type {
  CameraFacingMode,
  CameraStatus,
  CapturedPhoto,
} from '@/features/camera/types';

const STORAGE_KEY = 'nexa-utility-camera-photos';

function loadPhotos(): CapturedPhoto[] {
  const stored =
    localStorageAdapter.get<unknown>(STORAGE_KEY);

  return Array.isArray(stored)
    ? (stored as CapturedPhoto[])
    : [];
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<CameraStatus>('idle');
  const [facingMode, setFacingMode] =
    useState<CameraFacingMode>('environment');
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);

  useEffect(() => {
    setPhotos(loadPhotos());
  }, []);

  const persistPhotos = useCallback(
    (nextPhotos: CapturedPhoto[]) => {
      setPhotos(nextPhotos);

      localStorageAdapter.set(
        STORAGE_KEY,
        nextPhotos,
      );
    },
    [],
  );

  const startCamera = useCallback(
    async (mode: CameraFacingMode = facingMode) => {
      if (!isCameraSupported()) {
        setError(
          'Camera access is not supported by this browser.',
        );
        setStatus('error');
        return;
      }

      setStatus('requesting');
      setError('');

      stopCameraStream(streamRef.current);
      streamRef.current = null;

      try {
        const stream = await requestCameraStream(mode);

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setFacingMode(mode);
        setStatus('active');
      } catch (cameraError) {
        console.error(cameraError);

        setError(
          'Camera permission was denied or the camera is unavailable.',
        );
        setStatus('error');
      }
    },
    [facingMode],
  );

  const stopCamera = useCallback(() => {
    stopCameraStream(streamRef.current);
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setStatus('idle');
  }, []);

  const toggleCamera = useCallback(async () => {
    const nextMode =
      facingMode === 'environment' ? 'user' : 'environment';

    await startCamera(nextMode);
  }, [facingMode, startCamera]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    if (
      videoRef.current.readyState <
      HTMLMediaElement.HAVE_CURRENT_DATA
    ) {
      return null;
    }

    try {
      const dataUrl =
        captureVideoFrame(videoRef.current);

      const photo: CapturedPhoto = {
        id: crypto.randomUUID(),
        dataUrl,
        createdAt: new Date().toISOString(),
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      persistPhotos(
        [photo, ...photos].slice(0, 20),
      );

      return photo;
    } catch (captureError) {
      console.error(captureError);
      setError('Unable to capture the photo.');
      return null;
    }
  }, [photos, persistPhotos]);

  const deletePhoto = useCallback(
    (id: string) => {
      persistPhotos(
        photos.filter(
          (photo) => photo.id !== id,
        ),
      );
    },
    [photos, persistPhotos],
  );

  const clearPhotos = useCallback(() => {
    persistPhotos([]);
  }, [persistPhotos]);

  useEffect(() => {
    return () => {
      stopCameraStream(streamRef.current);
    };
  }, []);

  return {
    videoRef,
    status,
    facingMode,
    error,
    photos,
    startCamera,
    stopCamera,
    toggleCamera,
    capturePhoto,
    deletePhoto,
    clearPhotos,
  };
}
