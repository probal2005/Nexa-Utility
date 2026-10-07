'use client';

import {
  BookOpen,
  Clock3,
  Trash2,
} from 'lucide-react';
import type { StudySession } from '@/features/study/types';
import {
  formatStudyTime,
} from '@/features/study/lib/sessions';

type SessionHistoryProps = {
  sessions: StudySession[];
  onDelete: (id: string) => void;
};

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(timestamp);
}

export function SessionHistory({
  sessions,
  onDelete,
}: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-border p-10 text-center">
        <BookOpen className="mx-auto h-9 w-9 text-muted-foreground" />

        <h2 className="mt-4 font-semibold">
          No study sessions yet
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Complete your first focus session and it will appear
          here.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">
          Recent Sessions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your latest completed study sessions.
        </p>
      </div>

      <div className="divide-y divide-border">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between gap-4 p-5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />

                <h3 className="truncate font-medium">
                  {session.subject}
                </h3>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />

                <span>
                  {formatStudyTime(
                    session.durationMinutes,
                  )}
                </span>

                <span>•</span>

                <span>
                  {formatDate(session.startedAt)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                onDelete(session.id)
              }
              aria-label={`Delete ${session.subject} session`}
              className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
