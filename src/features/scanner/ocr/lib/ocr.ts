import { createWorker } from "tesseract.js";

export async function recognizeText(
  image: string | File | Blob,
  onProgress?: (progress: number) => void,
): Promise<{
  text: string;
  confidence: number;
}> {
  const worker = await createWorker("eng", 1, {
    logger: (message) => {
      if (message.status === "recognizing text") {
        onProgress?.(Math.round(message.progress * 100));
      }
    },
  });

  try {
    const result = await worker.recognize(image);

    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
    };
  } finally {
    await worker.terminate();
  }
}

export function createOCRResult(
  text: string,
  confidence: number,
) {
  return {
    text,
    confidence,
    createdAt: Date.now(),
  };
}
