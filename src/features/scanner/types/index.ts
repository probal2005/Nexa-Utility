export type ScannerTool = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: "qr" | "barcode" | "document" | "camera" | "ocr";
  available: boolean;
};
