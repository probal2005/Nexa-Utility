import { localStorageAdapter } from "@/lib/storage";

import type {
  AnalyticsData,
  StudyAnalyticsStats,
  WeeklyStudyData,
} from "../types";

const SESSIONS_STORAGE_KEY = "nexa-utility-study-sessions";
const EXAMS_STORAGE_KEY = "nexa-utility-study-exams";
const PLANNER_STORAGE_KEY = "nexa-utility-study-planner";

type StoredSession = {
  id: string;
  subject: string;
  durationMinutes: number;
  startedAt: number;
  completedAt: number | null;
};

type StoredExam = {
  id: string;
  name: string;
  subject: string;
  date: string;
  createdAt: number;
};

type StoredPlannerItem = {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: string;
  priority: string;
  status: string;
  dueDate: string;
  dueTime: string;
  examId: string | null;
  createdAt: number;
  completedAt: number | null;
};

function readStorage<T>(key: string, fallback: T): T {
  const stored = localStorageAdapter.get<unknown>(key);

  if (stored === null || stored === undefined) {
    return fallback;
  }

  return stored as T;
}

function isSameDay(timestamp: number, date: Date): boolean {
  const value = new Date(timestamp);

  return (
    value.getFullYear() === date.getFullYear() &&
    value.getMonth() === date.getMonth() &&
    value.getDate() === date.getDate()
  );
}

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getStartOfDay(date: Date): Date {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function getWeeklyStudyData(
  sessions: StoredSession[],
  today: Date,
): WeeklyStudyData[] {
  const result: WeeklyStudyData[] = [];

  const start = getStartOfDay(today);

  start.setDate(start.getDate() - 6);

  for (let index = 0; index < 7; index += 1) {
    const current = new Date(start);

    current.setDate(start.getDate() + index);

    const dateKey = getDateKey(current);

    const matchingSessions = sessions.filter((session) => {
      if (!session.completedAt) {
        return false;
      }

      return getDateKey(new Date(session.completedAt)) === dateKey;
    });

    const minutes = matchingSessions.reduce(
      (total, session) => total + session.durationMinutes,
      0,
    );

    result.push({
      day: current.toLocaleDateString(undefined, {
        weekday: "short",
      }),
      date: dateKey,
      minutes,
      sessions: matchingSessions.length,
    });
  }

  return result;
}

export function getStudyAnalytics(): AnalyticsData {
  const today = new Date();

  const sessions = readStorage<StoredSession[]>(
    SESSIONS_STORAGE_KEY,
    [],
  );

  const exams = readStorage<StoredExam[]>(
    EXAMS_STORAGE_KEY,
    [],
  );

  const plannerItems = readStorage<StoredPlannerItem[]>(
    PLANNER_STORAGE_KEY,
    [],
  );

  const completedSessions = sessions.filter(
    (session) => session.completedAt !== null,
  );

  const totalStudyMinutes = completedSessions.reduce(
    (total, session) => total + session.durationMinutes,
    0,
  );

  const todayStudyMinutes = completedSessions
    .filter(
      (session) =>
        session.completedAt &&
        isSameDay(session.completedAt, today),
    )
    .reduce(
      (total, session) => total + session.durationMinutes,
      0,
    );

  const upcomingExams = exams.filter(
    (exam) => new Date(exam.date).getTime() > today.getTime(),
  ).length;

  const plannerCompleted = plannerItems.filter(
    (item) => item.status === "completed",
  ).length;

  const plannerPending = plannerItems.filter(
    (item) =>
      item.status === "pending" ||
      item.status === "in-progress",
  ).length;

  const plannerOverdue = plannerItems.filter((item) => {
    if (item.status === "completed" || !item.dueDate) {
      return false;
    }

    const due = new Date(
      `${item.dueDate}T${item.dueTime || "23:59"}`,
    );

    return due.getTime() < today.getTime();
  }).length;

  const stats: StudyAnalyticsStats = {
    totalStudyMinutes,
    todayStudyMinutes,
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    upcomingExams,
    plannerTotal: plannerItems.length,
    plannerCompleted,
    plannerPending,
    plannerOverdue,
  };

  return {
    stats,
    weeklyStudy: getWeeklyStudyData(sessions, today),
  };
}

export function formatStudyTime(minutes: number): string {
  if (minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

export function getMaxWeeklyMinutes(
  data: WeeklyStudyData[],
): number {
  return Math.max(
    ...data.map((item) => item.minutes),
    1,
  );
}
