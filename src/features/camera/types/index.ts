export type CameraFacingMode = 'user' | 'environment';

export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'paused'
  | 'error';

export type CapturedPhoto = {
  id: string;
  dataUrl: string;
  createdAt: string;
  width: number;
  height: number;
};
