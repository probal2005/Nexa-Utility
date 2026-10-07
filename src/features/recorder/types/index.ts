export type RecordingStatus =
  | "idle"
  | "requesting"
  | "recording"
  | "paused"
  | "stopped"
  | "error";

export type VoiceRecording = {
  id: string;
  name: string;
  blob: Blob;
  mimeType: string;
  duration: number;
  size: number;
  createdAt: number;
};

export type RecorderState = {
  status: RecordingStatus;
  duration: number;
  error: string | null;
};
