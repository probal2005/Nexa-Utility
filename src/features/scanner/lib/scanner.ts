import type { ScannerTool } from "../types";

export const SCANNER_TOOLS: ScannerTool[] = [
  {
    id: "qr",
    title: "QR Scanner",
    description: "Scan QR codes using your device camera.",
    href: "/camera/qr",
    icon: "qr",
    available: true,
  },
  {
    id: "barcode",
    title: "Barcode Scanner",
    description: "Read common 1D product and inventory barcodes.",
    href: "/camera/barcode",
    icon: "barcode",
    available: true,
  },
  {
    id: "document",
    title: "Document Scanner",
    description: "Capture documents and prepare them for digital use.",
    href: "/camera/document",
    icon: "document",
    available: true,
  },
  {
    id: "camera",
    title: "Camera",
    description: "Capture photos directly from your device camera.",
    href: "/camera",
    icon: "camera",
    available: true,
  },
  {
    id: "ocr",
    title: "OCR Scanner",
    description:
      "Extract text from images using optical character recognition.",
    href: "/scanner/ocr",
    icon: "ocr",
    available: true,
  },
];
