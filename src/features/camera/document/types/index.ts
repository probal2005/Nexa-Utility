export type DocumentFilter =
  | 'original'
  | 'grayscale'
  | 'contrast';

export type DocumentScan = {
  id: string;
  dataUrl: string;
  filter: DocumentFilter;
  createdAt: number;
};
