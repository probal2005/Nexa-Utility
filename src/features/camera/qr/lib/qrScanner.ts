import jsQR from 'jsqr';

export function scanQRCode(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): string | null {
  if (
    video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
    video.videoWidth === 0 ||
    video.videoHeight === 0
  ) {
    return null;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const context = canvas.getContext('2d', {
    willReadFrequently: true,
  });

  if (!context) {
    return null;
  }

  context.drawImage(
    video,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const imageData = context.getImageData(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const result = jsQR(
    imageData.data,
    imageData.width,
    imageData.height,
  );

  return result?.data ?? null;
}

export function isUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    );
  } catch {
    return false;
  }
}
