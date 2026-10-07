import {
  BrowserMultiFormatOneDReader,
  type IScannerControls,
} from "@zxing/browser";

import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

import { isNexaPermissionEnabled } from "@/features/privacy/lib/access";

import type {
  BarcodeResult,
} from "../types";

export type BarcodeScanResult =
  BarcodeResult;

export type BarcodeScannerCallback = (
  result: BarcodeScanResult,
) => void;

const BARCODE_FORMATS = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.CODE_39,
  BarcodeFormat.CODE_93,
  BarcodeFormat.CODABAR,
  BarcodeFormat.EAN_13,
  BarcodeFormat.EAN_8,
  BarcodeFormat.ITF,
  BarcodeFormat.UPC_A,
  BarcodeFormat.UPC_E,
];

const formatNames: Record<number, string> = {
  [BarcodeFormat.CODE_128]: "CODE_128",
  [BarcodeFormat.CODE_39]: "CODE_39",
  [BarcodeFormat.CODE_93]: "CODE_93",
  [BarcodeFormat.CODABAR]: "CODABAR",
  [BarcodeFormat.EAN_13]: "EAN_13",
  [BarcodeFormat.EAN_8]: "EAN_8",
  [BarcodeFormat.ITF]: "ITF",
  [BarcodeFormat.UPC_A]: "UPC_A",
  [BarcodeFormat.UPC_E]: "UPC_E",
};

export async function startBarcodeScanner(
  videoElement: HTMLVideoElement,
  onResult: BarcodeScannerCallback,
): Promise<IScannerControls> {
  if (!isNexaPermissionEnabled("camera")) {
    throw new Error(
      "Camera access is disabled in Nexa Utility Privacy Center.",
    );
  }

  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new Error(
      "Camera access is not supported by this browser.",
    );
  }

  const hints = new Map();

  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    BARCODE_FORMATS,
  );

  hints.set(
    DecodeHintType.TRY_HARDER,
    true,
  );

  const reader =
    new BrowserMultiFormatOneDReader(
      hints,
    );

  let stream: MediaStream | null = null;

  try {
    /*
     * Nexa owns the camera stream.
     *
     * This is intentionally the same architecture
     * used by the working QR scanner.
     */
    stream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
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

    videoElement.srcObject = stream;

    await videoElement.play();

    /*
     * ZXing only decodes the already-running video.
     * It does not create or replace the camera stream.
     */
    return await reader.decodeFromVideoElement(
      videoElement,
      (result) => {
        if (!result) {
          return;
        }

        onResult({
          text: result.getText(),
          format:
            formatNames[
              result.getBarcodeFormat()
            ] ??
            result
              .getBarcodeFormat()
              .toString(),
          timestamp: Date.now(),
        });
      },
    );
  } catch (error) {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });

    if (videoElement.srcObject === stream) {
      videoElement.srcObject = null;
    }

    throw error;
  }
}
