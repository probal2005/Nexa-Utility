import {
  degrees,
  PDFDocument,
} from 'pdf-lib';

import type {
  PDFPageRotation,
} from '../types';

function bytesToBlob(
  bytes: Uint8Array,
): Blob {
  const buffer = new ArrayBuffer(
    bytes.byteLength,
  );

  new Uint8Array(buffer).set(bytes);

  return new Blob(
    [buffer],
    {
      type: 'application/pdf',
    },
  );
}

export function formatPDFSize(
  bytes: number,
): string {
  if (bytes <= 0) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes / 1024 ** index;

  return `${value.toFixed(
    index === 0
      ? 0
      : value >= 100
        ? 0
        : 1,
  )} ${units[index]}`;
}

export function isPDF(
  file: File,
): boolean {
  return (
    file.type === 'application/pdf' ||
    file.name
      .toLowerCase()
      .endsWith('.pdf')
  );
}

export function isImage(
  file: File,
): boolean {
  return file.type.startsWith(
    'image/',
  );
}

export async function getPDFPageCount(
  file: File,
): Promise<number> {
  const bytes =
    await file.arrayBuffer();

  const pdf =
    await PDFDocument.load(bytes);

  return pdf.getPageCount();
}

export async function mergePDFs(
  files: File[],
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error(
      'Select at least one PDF.',
    );
  }

  const output =
    await PDFDocument.create();

  for (const file of files) {
    const bytes =
      await file.arrayBuffer();

    const source =
      await PDFDocument.load(bytes);

    const pages =
      await output.copyPages(
        source,
        source.getPageIndices(),
      );

    pages.forEach((page) =>
      output.addPage(page),
    );
  }

  const bytes =
    await output.save();

  return bytesToBlob(bytes);
}

export async function splitPDF(
  file: File,
  pageNumbers: number[],
): Promise<Blob> {
  const bytes =
    await file.arrayBuffer();

  const source =
    await PDFDocument.load(bytes);

  const output =
    await PDFDocument.create();

  const validPages =
    pageNumbers.filter(
      (page) =>
        page >= 1 &&
        page <=
          source.getPageCount(),
    );

  if (validPages.length === 0) {
    throw new Error(
      'No valid pages selected.',
    );
  }

  const copiedPages =
    await output.copyPages(
      source,
      validPages.map(
        (page) => page - 1,
      ),
    );

  copiedPages.forEach((page) =>
    output.addPage(page),
  );

  const result =
    await output.save();

  return bytesToBlob(result);
}

export async function rotatePDF(
  file: File,
  rotation: PDFPageRotation,
): Promise<Blob> {
  const bytes =
    await file.arrayBuffer();

  const pdf =
    await PDFDocument.load(bytes);

  pdf.getPages().forEach((page) => {
    const current =
      page.getRotation().angle;

    page.setRotation(
      degrees(
        (current + rotation) % 360,
      ),
    );
  });

  const result =
    await pdf.save();

  return bytesToBlob(result);
}

export async function imagesToPDF(
  files: File[],
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error(
      'Select at least one image.',
    );
  }

  const pdf =
    await PDFDocument.create();

  for (const file of files) {
    if (!isImage(file)) {
      continue;
    }

    const bytes =
      await file.arrayBuffer();

    const mime =
      file.type.toLowerCase();

    let image;

    if (
      mime === 'image/jpeg' ||
      mime === 'image/jpg'
    ) {
      image =
        await pdf.embedJpg(bytes);
    } else if (
      mime === 'image/png'
    ) {
      image =
        await pdf.embedPng(bytes);
    } else {
      const converted =
        await convertImageToPNG(file);

      image =
        await pdf.embedPng(
          converted,
        );
    }

    const dimensions =
      image.scale(1);

    const maxWidth = 595;
    const maxHeight = 842;

    const scale = Math.min(
      maxWidth / dimensions.width,
      maxHeight / dimensions.height,
      1,
    );

    const width =
      dimensions.width * scale;

    const height =
      dimensions.height * scale;

    const page =
      pdf.addPage([
        width,
        height,
      ]);

    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  if (pdf.getPageCount() === 0) {
    throw new Error(
      'No supported images were selected.',
    );
  }

  const result =
    await pdf.save();

  return bytesToBlob(result);
}

async function convertImageToPNG(
  file: File,
): Promise<ArrayBuffer> {
  const bitmap =
    await createImageBitmap(file);

  const canvas =
    document.createElement('canvas');

  canvas.width =
    bitmap.width;

  canvas.height =
    bitmap.height;

  const context =
    canvas.getContext('2d');

  if (!context) {
    bitmap.close();

    throw new Error(
      'Unable to process image.',
    );
  }

  context.drawImage(
    bitmap,
    0,
    0,
  );

  bitmap.close();

  const blob =
    await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          'image/png',
        ),
    );

  if (!blob) {
    throw new Error(
      'Unable to convert image.',
    );
  }

  return blob.arrayBuffer();
}

export function downloadBlob(
  blob: Blob,
  filename: string,
): void {
  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement('a');

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
