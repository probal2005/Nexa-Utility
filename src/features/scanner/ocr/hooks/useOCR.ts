"use client";

import { useCallback, useState } from "react";
import { createOCRResult, recognizeText } from "../lib/ocr";
import type { OCRResult, OCRStatus } from "../types";

export function useOCR() {
  const [status, setStatus] = useState<OCRStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognize = useCallback(async (image: string | File | Blob) => {
    setStatus("loading");
    setProgress(0);
    setResult(null);
    setError(null);

    try {
      setStatus("recognizing");

      const recognized = await recognizeText(image, setProgress);

      const nextResult = createOCRResult(
        recognized.text,
        recognized.confidence,
      );

      setResult(nextResult);
      setProgress(100);
      setStatus("completed");

      return nextResult;
    } catch (recognitionError) {
      console.error("OCR recognition failed:", recognitionError);

      const message =
        recognitionError instanceof Error
          ? recognitionError.message
          : "Unable to recognize text from this image.";

      setError(message);
      setStatus("error");

      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return {
    status,
    progress,
    result,
    error,
    recognize,
    reset,
  };
}
