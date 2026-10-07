import type { DocumentFilter } from '../types';

export function createCanvas(
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas =
    document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  return canvas;
}

export function isVideoReady(
  video: HTMLVideoElement,
): boolean {
  return (
    video.readyState >=
      HTMLMediaElement.HAVE_CURRENT_DATA &&
    video.videoWidth > 0 &&
    video.videoHeight > 0
  );
}

export async function waitForVideoReady(
  video: HTMLVideoElement,
  timeout = 5000,
): Promise<void> {
  if (isVideoReady(video)) {
    return;
  }

  await new Promise<void>(
    (resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        video.removeEventListener(
          'loadedmetadata',
          handleReady,
        );

        video.removeEventListener(
          'canplay',
          handleReady,
        );

        video.removeEventListener(
          'playing',
          handleReady,
        );

        video.removeEventListener(
          'error',
          handleError,
        );

        window.clearTimeout(
          timeoutId,
        );
      };

      const finish = () => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        resolve();
      };

      const handleReady = () => {
        if (isVideoReady(video)) {
          finish();
        }
      };

      const handleError = () => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();

        reject(
          new Error(
            'The camera video stream failed to load.',
          ),
        );
      };

      const timeoutId =
        window.setTimeout(() => {
          if (settled) {
            return;
          }

          settled = true;
          cleanup();

          reject(
            new Error(
              'Camera frame is not ready yet. Please wait for the camera preview and try again.',
            ),
          );
        }, timeout);

      video.addEventListener(
        'loadedmetadata',
        handleReady,
      );

      video.addEventListener(
        'canplay',
        handleReady,
      );

      video.addEventListener(
        'playing',
        handleReady,
      );

      video.addEventListener(
        'error',
        handleError,
      );

      handleReady();
    },
  );
}

export async function captureVideoFrame(
  video: HTMLVideoElement,
): Promise<HTMLCanvasElement> {
  await waitForVideoReady(video);

  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    throw new Error(
      'Camera frame is not ready yet.',
    );
  }

  const canvas = createCanvas(
    width,
    height,
  );

  const context =
    canvas.getContext('2d');

  if (!context) {
    throw new Error(
      'Unable to create image processing context.',
    );
  }

  context.drawImage(
    video,
    0,
    0,
    width,
    height,
  );

  return canvas;
}

export function applyDocumentFilter(
  sourceCanvas: HTMLCanvasElement,
  filter: DocumentFilter,
): HTMLCanvasElement {
  if (filter === 'original') {
    return sourceCanvas;
  }

  const canvas = createCanvas(
    sourceCanvas.width,
    sourceCanvas.height,
  );

  const sourceContext =
    sourceCanvas.getContext('2d');

  const context =
    canvas.getContext('2d');

  if (!sourceContext || !context) {
    throw new Error(
      'Unable to process scanned document.',
    );
  }

  const imageData =
    sourceContext.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height,
    );

  const pixels = imageData.data;

  for (
    let index = 0;
    index < pixels.length;
    index += 4
  ) {
    const red = pixels[index];
    const green = pixels[index + 1];
    const blue = pixels[index + 2];

    const grayscale =
      0.299 * red +
      0.587 * green +
      0.114 * blue;

    if (filter === 'grayscale') {
      pixels[index] = grayscale;
      pixels[index + 1] = grayscale;
      pixels[index + 2] = grayscale;

      continue;
    }

    if (filter === 'contrast') {
      const factor =
        (259 * (128 + 80)) /
        (255 * (259 - 80));

      const adjustedRed =
        factor * (red - 128) + 128;

      const adjustedGreen =
        factor * (green - 128) + 128;

      const adjustedBlue =
        factor * (blue - 128) + 128;

      pixels[index] = Math.min(
        255,
        Math.max(0, adjustedRed),
      );

      pixels[index + 1] = Math.min(
        255,
        Math.max(0, adjustedGreen),
      );

      pixels[index + 2] = Math.min(
        255,
        Math.max(0, adjustedBlue),
      );
    }
  }

  context.putImageData(
    imageData,
    0,
    0,
  );

  return canvas;
}

export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
): string {
  return canvas.toDataURL(
    'image/jpeg',
    0.92,
  );
}

export function downloadDocument(
  dataUrl: string,
  filename = 'nexa-document-scan.jpg',
): void {
  const anchor =
    document.createElement('a');

  anchor.href = dataUrl;
  anchor.download = filename;

  document.body.appendChild(anchor);

  anchor.click();

  anchor.remove();
}
