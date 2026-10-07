import { isNexaPermissionEnabled } from "@/features/privacy/lib/access";

export function isCameraSupported(): boolean {
  return (
    typeof navigator !== "undefined" &&
    "mediaDevices" in navigator &&
    typeof navigator.mediaDevices?.getUserMedia === "function"
  );
}

export function isNexaCameraEnabled(): boolean {
  return isNexaPermissionEnabled("camera");
}

export async function requestCameraStream(
  facingMode: "user" | "environment" = "environment",
): Promise<MediaStream> {
  if (!isNexaCameraEnabled()) {
    throw new Error(
      "Camera access is disabled in Nexa Utility Privacy Center.",
    );
  }

  if (!isCameraSupported()) {
    throw new Error(
      "Camera access is not supported by this browser.",
    );
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {
        ideal: facingMode,
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
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;

  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

export function captureVideoFrame(
  video: HTMLVideoElement,
  quality = 0.92,
): string {
  const canvas = document.createElement("canvas");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Unable to create camera capture context.");
  }

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", quality);
}

export function downloadPhoto(
  dataUrl: string,
  filename = "nexa-camera-photo.jpg",
): void {
  const link = document.createElement("a");

  link.href = dataUrl;
  link.download = filename;
  link.click();
}
