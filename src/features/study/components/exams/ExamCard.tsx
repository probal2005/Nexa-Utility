'use client';

import {
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
} from 'lucide-react';
import type { Exam } from '@/features/study/types';
import {
  formatExamDate,
  getExamStatus,
} from '@/features/study/lib/exams';
import { useExamCountdown } from '@/features/study/hooks/useExamCountdown';

type ExamCardProps = {
  exam: Exam;
  onEdit: () => void;
  onDelete: () => void;
};

function pad(value: number) {
  return String(value).padStart(2, '0');
}

export function ExamCard({
  exam,
  onEdit,
  onDelete,
}: ExamCardProps) {
  const countdown = useExamCountdown(exam.date);

  const status = getExamStatus(
    exam.date,
    Date.now(),
  );

  const completed = status === 'completed';

  return (
    <article className="rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                completed
                  ? 'bg-muted text-muted-foreground'
                  : status === 'today'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {completed
                ? 'Completed'
                : status === 'today'
                  ? 'Today'
                  : 'Upcoming'}
            </span>
          </div>

          <h3 className="truncate text-lg font-semibold">
            {exam.name || 'Untitled Exam'}
          </h3>

          <p className="mt-1 truncate text-sm text-muted-foreground">
            {exam.subject || 'No subject'}
          </p>
        </div>

        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit exam"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete exam"
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="h-4 w-4" />
        {formatExamDate(exam.date)}
      </div>

      {!completed && (
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[
            ['Days', countdown.days],
            ['Hours', countdown.hours],
            ['Minutes', countdown.minutes],
            ['Seconds', countdown.seconds],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl bg-muted/50 p-3 text-center"
            >
              <div className="text-xl font-bold tabular-nums">
                {label === 'Days'
                  ? value
                  : pad(Number(value))}
              </div>

              <div className="mt-1 text-[11px] text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      )}

      {completed && (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
          <Clock3 className="h-4 w-4" />
          This exam has already passed.
        </div>
      )}
    </article>
  );
}
