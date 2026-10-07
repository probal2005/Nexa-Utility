export type PDFTool =
  | 'merge'
  | 'split'
  | 'rotate'
  | 'images-to-pdf'
  | 'pdf-to-images';

export type PDFFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number | null;
};

export type PDFPageRotation =
  | 0
  | 90
  | 180
  | 270;
