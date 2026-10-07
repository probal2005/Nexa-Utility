export type RepeatMode = 'off' | 'all' | 'one';

export type MusicTrack = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  size: number;
  type: string;
  duration: number;
  createdAt: number;
};
