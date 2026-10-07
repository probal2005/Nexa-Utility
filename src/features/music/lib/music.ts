export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** index;

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

export function getTrackName(fileName: string): string {
  const lastDot = fileName.lastIndexOf('.');

  if (lastDot <= 0) {
    return fileName;
  }

  return fileName.slice(0, lastDot);
}

export function getNextRepeatMode(
  mode: 'off' | 'all' | 'one',
): 'off' | 'all' | 'one' {
  if (mode === 'off') {
    return 'all';
  }

  if (mode === 'all') {
    return 'one';
  }

  return 'off';
}
