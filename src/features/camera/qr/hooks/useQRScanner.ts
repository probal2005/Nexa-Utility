"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isNexaPermissionEnabled } from "@/features/privacy/lib/access";

import {
  isUrl,
  scanQRCode,
} from "@/features/camera/qr/lib/qrScanner";

import type {
  QRResult,
  QRScannerStatus,
} from "@/features/camera/qr/types";

export function useQRScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const [status, setStatus] =
    useState<QRScannerStatus>("idle");

  const [facingMode, setFacingMode] =
    useState<"user" | "environment">("environment");

  const [result, setResult] =
    useState<QRResult | null>(null);

  const [error, setError] = useState("");

  const stopStream = useCallback(() => {
    if (animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const scanFrame = useCallback(() => {
    if (
      !videoRef.current ||
      !canvasRef.current ||
      status !== "scanning"
    ) {
      return;
    }

    const detected = scanQRCode(
      videoRef.current,
      canvasRef.current,
    );

    if (detected) {
      setResult({
        data: detected,
        detectedAt: new Date().toISOString(),
      });

      setStatus("detected");

      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      return;
    }

    animationRef.current =
      requestAnimationFrame(scanFrame);
  }, [status]);

  const startScanner = useCallback(
    async (
      mode: "user" | "environment" = facingMode,
    ) => {
      stopStream();

      setStatus("requesting");
      setError("");
      setResult(null);

      if (!isNexaPermissionEnabled("camera")) {
        setError(
          "Camera access is disabled in Nexa Utility Privacy Center.",
        );

        setStatus("error");

        return;
      }

      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setError(
          "Camera access is not supported by this browser.",
        );

        setStatus("error");

        return;
      }

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: mode,
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          });

        streamRef.current = stream;

        if (!videoRef.current) {
          throw new Error(
            "Camera preview is unavailable.",
          );
        }

        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        setFacingMode(mode);
        setStatus("scanning");
      } catch (scannerError) {
        console.error(scannerError);

        setError(
          "Unable to access the camera. Please check your browser permission.",
        );

        setStatus("error");
      }
    },
    [facingMode, stopStream],
  );

  const stopScanner = useCallback(() => {
    stopStream();
    setStatus("idle");
  }, [stopStream]);

  const scanAgain = useCallback(async () => {
    await startScanner(facingMode);
  }, [facingMode, startScanner]);

  const switchCamera = useCallback(async () => {
    const nextMode =
      facingMode === "environment"
        ? "user"
        : "environment";

    await startScanner(nextMode);
  }, [facingMode, startScanner]);

  useEffect(() => {
    if (status !== "scanning") {
      return;
    }

    animationRef.current =
      requestAnimationFrame(scanFrame);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [scanFrame, status]);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, [stopStream]);

  return {
    videoRef,
    canvasRef,
    status,
    facingMode,
    result,
    error,
    startScanner,
    stopScanner,
    scanAgain,
    switchCamera,
    isUrl,
  };
}
