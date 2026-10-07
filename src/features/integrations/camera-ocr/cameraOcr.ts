import { sessionStorageAdapter } from "@/lib/storage";

const CAMERA_OCR_STORAGE_KEY =
  "nexa-utility-camera-ocr-image";

export function saveCameraImageForOCR(
  dataUrl: string,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    sessionStorageAdapter.set(
      CAMERA_OCR_STORAGE_KEY,
      dataUrl,
    );

    return true;
  } catch (error) {
    console.error(
      "Unable to prepare camera image for OCR:",
      error,
    );

    return false;
  }
}

export function loadCameraImageForOCR(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sessionStorageAdapter.get<string>(
      CAMERA_OCR_STORAGE_KEY,
    );
  } catch {
    return null;
  }
}

export function clearCameraImageForOCR(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorageAdapter.remove(
      CAMERA_OCR_STORAGE_KEY,
    );
  } catch {
    // Ignore storage errors.
  }
}
