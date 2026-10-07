import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

import type {
  PomodoroMode,
  PomodoroSession,
  PomodoroSettings,
} from "../types";

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
};

export function getStoredSettings(): PomodoroSettings {
  const stored =
    localStorageAdapter.get<unknown>(
      STORAGE_KEYS.pomodoroSettings,
    );

  if (!stored || typeof stored !== "object") {
    return DEFAULT_POMODORO_SETTINGS;
  }

  return {
    ...DEFAULT_POMODORO_SETTINGS,
    ...(stored as Partial<PomodoroSettings>),
  };
}

export function saveSettings(
  settings: PomodoroSettings,
): void {
  localStorageAdapter.set(
    STORAGE_KEYS.pomodoroSettings,
    settings,
  );
}

export function getStoredSessions(): PomodoroSession[] {
  const stored =
    localStorageAdapter.get<unknown>(
      STORAGE_KEYS.pomodoroSessions,
    );

  return Array.isArray(stored)
    ? (stored as PomodoroSession[])
    : [];
}

export function saveSessions(
  sessions: PomodoroSession[],
): void {
  localStorageAdapter.set(
    STORAGE_KEYS.pomodoroSessions,
    sessions,
  );
}

export function getDurationSeconds(
  mode: PomodoroMode,
  settings: PomodoroSettings,
): number {
  switch (mode) {
    case "short-break":
      return settings.shortBreakMinutes * 60;

    case "long-break":
      return settings.longBreakMinutes * 60;

    case "focus":
    default:
      return settings.focusMinutes * 60;
  }
}

export function getModeLabel(
  mode: PomodoroMode,
): string {
  switch (mode) {
    case "short-break":
      return "Short Break";

    case "long-break":
      return "Long Break";

    case "focus":
    default:
      return "Focus";
  }
}

export function getNextMode(
  mode: PomodoroMode,
  completedFocusSessions: number,
  sessionsBeforeLongBreak: number,
): PomodoroMode {
  if (mode !== "focus") {
    return "focus";
  }

  return completedFocusSessions %
    sessionsBeforeLongBreak ===
    0
    ? "long-break"
    : "short-break";
}

export function createSession(
  mode: PomodoroMode,
  duration: number,
): PomodoroSession {
  return {
    id: crypto.randomUUID(),
    mode,
    duration,
    startedAt: Date.now(),
    completedAt: null,
    completed: false,
  };
}

export function completeSession(
  session: PomodoroSession,
): PomodoroSession {
  return {
    ...session,
    completed: true,
    completedAt: Date.now(),
  };
}

export function formatTime(
  seconds: number,
): string {
  const safeSeconds = Math.max(
    0,
    Math.floor(seconds),
  );

  const minutes = Math.floor(
    safeSeconds / 60,
  );

  const remainingSeconds =
    safeSeconds % 60;

  return `${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function getSessionStats(
  sessions: PomodoroSession[],
) {
  const completedFocusSessions =
    sessions.filter(
      (session) =>
        session.mode === "focus" &&
        session.completed,
    ).length;

  const completedBreaks =
    sessions.filter(
      (session) =>
        session.mode !== "focus" &&
        session.completed,
    ).length;

  const totalFocusMinutes =
    sessions.reduce(
      (total, session) =>
        session.mode === "focus" &&
        session.completed
          ? total + session.duration / 60
          : total,
      0,
    );

  const startOfToday =
    new Date();

  startOfToday.setHours(
    0,
    0,
    0,
    0,
  );

  const todayFocusMinutes =
    sessions.reduce(
      (total, session) =>
        session.mode === "focus" &&
        session.completed &&
        session.completedAt &&
        session.completedAt >=
          startOfToday.getTime()
          ? total + session.duration / 60
          : total,
      0,
    );

  return {
    completedFocusSessions,
    completedBreaks,
    totalFocusMinutes,
    todayFocusMinutes,
  };
}
