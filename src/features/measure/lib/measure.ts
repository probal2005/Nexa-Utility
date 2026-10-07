import type { MeasurePoint } from "../types";

export function calculatePixelDistance(
  first: MeasurePoint,
  second: MeasurePoint,
): number {
  const dx = second.x - first.x;
  const dy = second.y - first.y;

  return Math.sqrt(dx * dx + dy * dy);
}

export function calculateAngle(
  first: MeasurePoint,
  vertex: MeasurePoint,
  third: MeasurePoint,
): number {
  const vectorA = {
    x: first.x - vertex.x,
    y: first.y - vertex.y,
  };

  const vectorB = {
    x: third.x - vertex.x,
    y: third.y - vertex.y,
  };

  const dot =
    vectorA.x * vectorB.x +
    vectorA.y * vectorB.y;

  const magnitudeA = Math.sqrt(
    vectorA.x ** 2 + vectorA.y ** 2,
  );

  const magnitudeB = Math.sqrt(
    vectorB.x ** 2 + vectorB.y ** 2,
  );

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  const cosine = Math.min(
    1,
    Math.max(
      -1,
      dot / (magnitudeA * magnitudeB),
    ),
  );

  return (
    (Math.acos(cosine) * 180) /
    Math.PI
  );
}

export function pixelsToCentimeters(
  pixels: number,
  pixelsPerCentimeter: number,
): number {
  if (pixelsPerCentimeter <= 0) {
    return 0;
  }

  return pixels / pixelsPerCentimeter;
}

export function formatDistance(
  centimeters: number | null,
): string {
  if (centimeters === null) {
    return "—";
  }

  if (centimeters < 100) {
    return `${centimeters.toFixed(1)} cm`;
  }

  return `${(centimeters / 100).toFixed(2)} m`;
}

export function formatAngle(
  degrees: number | null,
): string {
  if (degrees === null) {
    return "—";
  }

  return `${degrees.toFixed(1)}°`;
}
