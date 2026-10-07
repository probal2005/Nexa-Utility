export type QRScannerStatus =
  | 'idle'
  | 'requesting'
  | 'scanning'
  | 'detected'
  | 'error';

export type QRResult = {
  data: string;
  detectedAt: string;
};
