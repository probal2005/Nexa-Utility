export type MapLocation = {
  latitude: number;
  longitude: number;
  name?: string;
};

export type PlaceResult = {
  id: string;
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  type?: string;
};
