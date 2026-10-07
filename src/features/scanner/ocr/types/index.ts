export type OCRStatus =
  | "idle"
  | "loading"
  | "recognizing"
  | "completed"
  | "error";

export type OCRResult = {
  text: string;
  confidence: number;
  createdAt: number;
};

export type OCRState = {
  status: OCRStatus;
  progress: number;
  result: OCRResult | null;
  error: string | null;
};
