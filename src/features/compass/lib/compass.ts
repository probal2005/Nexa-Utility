import type {
  CompassDirection,
} from '../types';

export function normalizeHeading(
  heading: number,
): number {
  return ((heading % 360) + 360) % 360;
}

export function headingToDirection(
  heading: number,
): CompassDirection {
  const normalized =
    normalizeHeading(heading);

  const directions: CompassDirection[] = [
    'N',
    'NE',
    'E',
    'SE',
    'S',
    'SW',
    'W',
    'NW',
  ];

  const index =
    Math.round(normalized / 45) % 8;

  return directions[index];
}

export function formatHeading(
  heading: number | null,
): string {
  if (heading === null) {
    return '--°';
  }

  return `${Math.round(
    normalizeHeading(heading),
  )}°`;
}

export function getDirectionLabel(
  direction: CompassDirection | null,
): string {
  if (!direction) {
    return 'Unknown';
  }

  const labels: Record<
    CompassDirection,
    string
  > = {
    N: 'North',
    NE: 'North-East',
    E: 'East',
    SE: 'South-East',
    S: 'South',
    SW: 'South-West',
    W: 'West',
    NW: 'North-West',
  };

  return labels[direction];
}
