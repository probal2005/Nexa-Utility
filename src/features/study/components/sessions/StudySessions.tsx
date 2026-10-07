'use client';

import {
  BookOpen,
  Clock3,
  GraduationCap,
  Trash2,
} from 'lucide-react';
import { useStudySessions } from '@/features/study/hooks/useStudySessions';
import {
  formatStudyTime,
} from '@/features/study/lib/sessions';
import { StudyTimer } from './StudyTimer';
import { SessionHistory } from './SessionHistory';

export function StudySessions() {
  const {
    recentSessions,
    stats,
    addSession,
    deleteSession,
    clearSessions,
  } = useStudySessions();

  function handleSessionComplete(
    subject: string,
    durationMinutes: number,
  ) {
    addSession(
      subject,
      durationMinutes,
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Study Tools
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Study Sessions
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Focus on one subject, track your study time, and build
            a consistent study history.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Clock3 className="h-4 w-4" />
              Today
            </div>

            <div className="text-3xl font-bold">
              {formatStudyTime(
                stats.todayMinutes,
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Total Study Time
            </div>

            <div className="text-3xl font-bold">
              {formatStudyTime(
                stats.totalMinutes,
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Today&apos;s Sessions
            </div>

            <div className="text-3xl font-bold">
              {stats.todaySessions}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Total Sessions
            </div>

            <div className="text-3xl font-bold">
              {stats.totalSessions}
            </div>
          </div>
        </section>

        <StudyTimer
          onSessionComplete={
            handleSessionComplete
          }
        />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Study History
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Keep track of your completed focus sessions.
            </p>
          </div>

          {stats.totalSessions > 0 && (
            <button
              type="button"
              onClick={clearSessions}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
              Clear History
            </button>
          )}
        </div>

        <SessionHistory
          sessions={recentSessions}
          onDelete={deleteSession}
        />

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-border p-3">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Build a consistent study habit
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Study Sessions stores your completed sessions
                locally in your browser. No account or backend is
                required, so your study history stays available
                even when you work offline.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
