import type { Exam } from '@/features/study/types';

export type ExamStatus =
  | 'upcoming'
  | 'today'
  | 'completed';

export type ExamCountdown = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getExamStatus(
  examDate: string,
  now = Date.now(),
): ExamStatus {
  const timestamp = new Date(examDate).getTime();

  if (!Number.isFinite(timestamp)) {
    return 'completed';
  }

  if (timestamp <= now) {
    return 'completed';
  }

  const today = new Date(now);
  const exam = new Date(timestamp);

  const sameDay =
    today.getFullYear() === exam.getFullYear() &&
    today.getMonth() === exam.getMonth() &&
    today.getDate() === exam.getDate();

  return sameDay ? 'today' : 'upcoming';
}

export function getExamCountdown(
  examDate: string,
  now = Date.now(),
): ExamCountdown {
  const timestamp = new Date(examDate).getTime();

  if (!Number.isFinite(timestamp)) {
    return {
      totalMilliseconds: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const totalMilliseconds = Math.max(
    0,
    timestamp - now,
  );

  const totalSeconds = Math.floor(
    totalMilliseconds / 1000,
  );

  const days = Math.floor(totalSeconds / 86400);

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  return {
    totalMilliseconds,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatExamDate(
  examDate: string,
): string {
  const date = new Date(examDate);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function sortExams(
  exams: Exam[],
): Exam[] {
  return [...exams].sort(
    (a, b) =>
      new Date(a.date).getTime() -
      new Date(b.date).getTime(),
  );
}

export function createExam(): Exam {
  const date = new Date();

  date.setDate(date.getDate() + 7);
  date.setHours(10, 0, 0, 0);

  return {
    id: crypto.randomUUID(),
    name: '',
    subject: '',
    date: date.toISOString().slice(0, 16),
    createdAt: Date.now(),
  };
}
