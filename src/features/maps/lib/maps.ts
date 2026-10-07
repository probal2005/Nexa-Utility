import type {
  PlaceResult,
} from '../types';

const NOMINATIM_URL =
  'https://nominatim.openstreetmap.org/search';

export async function searchPlaces(
  query: string,
): Promise<PlaceResult[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const url = new URL(
    NOMINATIM_URL,
  );

  url.searchParams.set(
    'q',
    trimmed,
  );

  url.searchParams.set(
    'format',
    'jsonv2',
  );

  url.searchParams.set(
    'limit',
    '8',
  );

  const response = await fetch(
    url.toString(),
    {
      headers: {
        Accept:
          'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      'Unable to search for places.',
    );
  }

  const data =
    (await response.json()) as Array<{
      place_id: number;
      display_name: string;
      lat: string;
      lon: string;
      type?: string;
    }>;

  return data.map(
    (item) => ({
      id: String(
        item.place_id,
      ),
      name:
        item.display_name.split(
          ',',
        )[0] ?? item.display_name,
      displayName:
        item.display_name,
      latitude:
        Number.parseFloat(
          item.lat,
        ),
      longitude:
        Number.parseFloat(
          item.lon,
        ),
      type: item.type,
    }),
  );
}

export function formatCoordinates(
  latitude: number,
  longitude: number,
): string {
  return `${latitude.toFixed(
    6,
  )}, ${longitude.toFixed(6)}`;
}
