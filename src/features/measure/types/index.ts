export type MeasureMode =
  | "distance"
  | "angle"
  | "height";

export type MeasureStatus =
  | "idle"
  | "ready"
  | "measuring"
  | "complete"
  | "unsupported"
  | "error";

export type MeasurePoint = {
  x: number;
  y: number;
  timestamp: number;
};

export type DistanceMeasurement = {
  start: MeasurePoint | null;
  end: MeasurePoint | null;
  pixels: number;
  centimeters: number | null;
  meters: number | null;
};

export type AngleMeasurement = {
  first: MeasurePoint | null;
  vertex: MeasurePoint | null;
  third: MeasurePoint | null;
  degrees: number | null;
};

export type MeasureState = {
  mode: MeasureMode;
  status: MeasureStatus;
  distance: DistanceMeasurement;
  angle: AngleMeasurement;
  error: string | null;
};
