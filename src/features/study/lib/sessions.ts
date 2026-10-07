import type { StudySession } from '@/features/study/types';

export type SessionStats = {
  totalMinutes: number;
  todayMinutes: number;
  totalSessions: number;
  todaySessions: number;
};

export function formatStudyTime(minutes: number): string {
  const safeMinutes = Math.max(0, Math.floor(minutes));

  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function formatTimer(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const remainingSeconds = safeSeconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function calculateSessionStats(
  sessions: StudySession[],
): SessionStats {
  const totalMinutes = sessions.reduce(
    (total, session) =>
      total + Math.max(0, session.durationMinutes),
    0,
  );

  const todaySessions = sessions.filter((session) =>
    isToday(session.startedAt),
  );

  const todayMinutes = todaySessions.reduce(
    (total, session) =>
      total + Math.max(0, session.durationMinutes),
    0,
  );

  return {
    totalMinutes,
    todayMinutes,
    totalSessions: sessions.length,
    todaySessions: todaySessions.length,
  };
}

export function createStudySession(
  subject: string,
  durationMinutes: number,
): StudySession {
  return {
    id: crypto.randomUUID(),
    subject: subject.trim() || 'General Study',
    durationMinutes: Math.max(
      1,
      Math.round(durationMinutes),
    ),
    startedAt: Date.now(),
    completedAt: Date.now(),
  };
}
