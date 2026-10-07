'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  DEFAULT_POMODORO_SETTINGS,
  completeSession,
  createSession,
  getDurationSeconds,
  getNextMode,
  getSessionStats,
  getStoredSessions,
  getStoredSettings,
  saveSessions,
  saveSettings,
} from '../lib/pomodoro';

import type {
  PomodoroMode,
  PomodoroSession,
  PomodoroSettings,
} from '../types';

import { notify } from '@/lib/notifications';

export function usePomodoro() {
  const [
    settings,
    setSettings,
  ] = useState<PomodoroSettings>(
    DEFAULT_POMODORO_SETTINGS,
  );

  const [
    sessions,
    setSessions,
  ] = useState<PomodoroSession[]>([]);

  const [
    mode,
    setMode,
  ] = useState<PomodoroMode>('focus');

  const [
    remaining,
    setRemaining,
  ] = useState(
    DEFAULT_POMODORO_SETTINGS
      .focusMinutes * 60,
  );

  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const [
    completedFocusSessions,
    setCompletedFocusSessions,
  ] = useState(0);

  const currentSessionRef =
    useRef<PomodoroSession | null>(
      null,
    );

  useEffect(() => {
    const storedSettings =
      getStoredSettings();

    const storedSessions =
      getStoredSessions();

    setSettings(storedSettings);
    setSessions(storedSessions);
    setRemaining(
      getDurationSeconds(
        'focus',
        storedSettings,
      ),
    );

    const focusCount =
      storedSessions.filter(
        (session) =>
          session.mode === 'focus' &&
          session.completed,
      ).length;

    setCompletedFocusSessions(
      focusCount %
        storedSettings
          .sessionsBeforeLongBreak,
    );
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveSettings(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      sessions.length >= 0
    ) {
      saveSessions(sessions);
    }
  }, [sessions]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval =
      window.setInterval(() => {
        setRemaining((current) =>
          current > 0
            ? current - 1
            : 0,
        );
      }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    if (
      !isRunning ||
      remaining > 0
    ) {
      return;
    }

    setIsRunning(false);

    if (currentSessionRef.current) {
      const completed =
        completeSession(
          currentSessionRef.current,
        );

      setSessions((current) => [
        completed,
        ...current,
      ]);

      if (mode === 'focus') {
        const nextCount =
          completedFocusSessions + 1;

        setCompletedFocusSessions(
          nextCount %
            settings
              .sessionsBeforeLongBreak,
        );

        notify({
          type: 'pomodoro',
          title: 'Focus session complete',
          message:
            'Nice work. Time for a break.',
          priority: 'normal',
          action: {
            label: 'Open Pomodoro',
            href: '/pomodoro',
          },
          metadata: {
            mode: 'focus',
          },
        });
      } else {
        notify({
          type: 'pomodoro',
          title: 'Break complete',
          message:
            'Ready for another focus session?',
          priority: 'normal',
          action: {
            label: 'Open Pomodoro',
            href: '/pomodoro',
          },
          metadata: {
            mode,
          },
        });
      }

      currentSessionRef.current =
        null;
    }

    const nextMode =
      getNextMode(
        mode,
        completedFocusSessions + 1,
        settings.sessionsBeforeLongBreak,
      );

    setMode(nextMode);
    setRemaining(
      getDurationSeconds(
        nextMode,
        settings,
      ),
    );
  }, [
    remaining,
    isRunning,
    mode,
    settings,
    completedFocusSessions,
  ]);

  const start = useCallback(
    async () => {
      if (isRunning) {
        return;
      }

      if (!currentSessionRef.current) {
        currentSessionRef.current =
          createSession(
            mode,
            remaining,
          );
      }

      setIsRunning(true);
    },
    [
      isRunning,
      mode,
      remaining,
    ],
  );

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    currentSessionRef.current = null;
    setRemaining(
      getDurationSeconds(
        mode,
        settings,
      ),
    );
  }, [mode, settings]);

  const changeMode = useCallback(
    (nextMode: PomodoroMode) => {
      setIsRunning(false);
      currentSessionRef.current =
        null;
      setMode(nextMode);
      setRemaining(
        getDurationSeconds(
          nextMode,
          settings,
        ),
      );
    },
    [settings],
  );

  const updateSettings =
    useCallback(
      (
        updates: Partial<PomodoroSettings>,
      ) => {
        setIsRunning(false);
        currentSessionRef.current =
          null;

        setSettings((current) => ({
          ...current,
          ...updates,
        }));

        setRemaining(
          getDurationSeconds(
            mode,
            {
              ...settings,
              ...updates,
            },
          ),
        );
      },
      [mode, settings],
    );

  const stats = useMemo(
    () => getSessionStats(sessions),
    [sessions],
  );

  const currentDuration =
    getDurationSeconds(
      mode,
      settings,
    );

  const progress =
    currentDuration > 0
      ? ((currentDuration -
          remaining) /
          currentDuration) *
        100
      : 0;

  return {
    settings,
    sessions,
    stats,
    mode,
    remaining,
    progress,
    isRunning,
    start,
    pause,
    reset,
    changeMode,
    updateSettings,
  };
}
