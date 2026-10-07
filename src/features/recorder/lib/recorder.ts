import type { VoiceRecording } from "../types";

export function createRecordingId(): string {
  return `recording-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function getDefaultRecordingName(timestamp?: number): string {
  const date = new Date(timestamp ?? Date.now());

  return `Recording ${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getRecordingMimeType(): string {
  if (
    typeof MediaRecorder !== "undefined" &&
    MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
  ) {
    return "audio/webm;codecs=opus";
  }

  if (
    typeof MediaRecorder !== "undefined" &&
    MediaRecorder.isTypeSupported("audio/webm")
  ) {
    return "audio/webm";
  }

  if (
    typeof MediaRecorder !== "undefined" &&
    MediaRecorder.isTypeSupported("audio/mp4")
  ) {
    return "audio/mp4";
  }

  return "audio/webm";
}

export function createRecording(
  blob: Blob,
  duration: number,
  mimeType: string,
  name = getDefaultRecordingName(),
): VoiceRecording {
  return {
    id: createRecordingId(),
    name,
    blob,
    duration,
    mimeType,
    size: blob.size,
    createdAt: Date.now(),
  };
}

export function formatRecordingDuration(seconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatRecordingDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatRecordingSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function createAudioUrl(recording: VoiceRecording): string {
  return URL.createObjectURL(recording.blob);
}

export function revokeAudioUrl(url: string): void {
  URL.revokeObjectURL(url);
}

export function downloadRecording(recording: VoiceRecording): void {
  const url = createAudioUrl(recording);
  const anchor = document.createElement("a");

  const extension = recording.mimeType.includes("mp4")
    ? "mp4"
    : recording.mimeType.includes("ogg")
      ? "ogg"
      : "webm";

  const safeName =
    recording.name.replace(/[^a-z0-9-_ ]/gi, "").trim() || "recording";

  anchor.href = url;
  anchor.download = `${safeName}.${extension}`;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => {
    revokeAudioUrl(url);
  }, 100);
}
