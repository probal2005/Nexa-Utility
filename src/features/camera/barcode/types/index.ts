export type BarcodeFormat =
  | 'CODE_128'
  | 'CODE_39'
  | 'CODE_93'
  | 'CODABAR'
  | 'EAN_13'
  | 'EAN_8'
  | 'ITF'
  | 'UPC_A'
  | 'UPC_E'
  | string;

export type BarcodeResult = {
  text: string;
  format: BarcodeFormat;
  timestamp: number;
};
