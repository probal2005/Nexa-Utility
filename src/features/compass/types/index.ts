export type CompassDirection =
  | 'N'
  | 'NE'
  | 'E'
  | 'SE'
  | 'S'
  | 'SW'
  | 'W'
  | 'NW';

export type CompassStatus =
  | 'idle'
  | 'starting'
  | 'requesting'
  | 'active'
  | 'stopped'
  | 'unsupported'
  | 'permission-denied'
  | 'error';

export type CompassReading = {
  heading: number | null;
  direction: CompassDirection | null;
  accuracy?: number | null;
  timestamp: number;
};

export type CompassState = {
  heading: number | null;
  direction: CompassDirection | null;
  supported: boolean;
  permissionRequired: boolean;
  permissionGranted: boolean;
  listening: boolean;
  error: string | null;
};

export type CompassInfo = {
  status: CompassStatus;
  reading: CompassReading | null;
  supported: boolean;
  permissionGranted: boolean;
  error: string | null;
};
