"use client";

import { useEffect, useMemo, useState } from "react";

import { localStorageAdapter } from "@/lib/storage";

import type { StudySession } from "@/features/study/types";

import {
  calculateSessionStats,
  createStudySession,
} from "@/features/study/lib/sessions";

const STORAGE_KEY = "nexa-utility-study-sessions";

function loadSessions(): StudySession[] {
  const stored = localStorageAdapter.get<unknown>(
    STORAGE_KEY,
  );

  return Array.isArray(stored)
    ? (stored as StudySession[])
    : [];
}

export function useStudySessions() {
  const [sessions, setSessions] =
    useState<StudySession[]>(loadSessions);

  useEffect(() => {
    localStorageAdapter.set(
      STORAGE_KEY,
      sessions,
    );
  }, [sessions]);

  const stats = useMemo(
    () => calculateSessionStats(sessions),
    [sessions],
  );

  const recentSessions = useMemo(
    () =>
      [...sessions]
        .sort(
          (a, b) =>
            b.startedAt - a.startedAt,
        )
        .slice(0, 20),
    [sessions],
  );

  function addSession(
    subject: string,
    durationMinutes: number,
  ) {
    const session = createStudySession(
      subject,
      durationMinutes,
    );

    setSessions((current) => [
      session,
      ...current,
    ]);
  }

  function deleteSession(id: string) {
    setSessions((current) =>
      current.filter(
        (session) => session.id !== id,
      ),
    );
  }

  function clearSessions() {
    setSessions([]);
  }

  return {
    sessions,
    recentSessions,
    stats,
    addSession,
    deleteSession,
    clearSessions,
  };
}
