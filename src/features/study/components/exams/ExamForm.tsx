'use client';

import { Save, X } from 'lucide-react';
import type { Exam } from '@/features/study/types';

type ExamFormProps = {
  exam: Exam;
  onChange: (updates: Partial<Exam>) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ExamForm({
  exam,
  onChange,
  onSave,
  onCancel,
}: ExamFormProps) {
  const canSave =
    exam.name.trim().length > 0 &&
    exam.subject.trim().length > 0 &&
    exam.date.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">
            {exam.name ? 'Edit Exam' : 'New Exam'}
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add the exam details and schedule.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Exam Name
          </span>

          <input
            type="text"
            value={exam.name}
            onChange={(event) =>
              onChange({
                name: event.target.value,
              })
            }
            placeholder="e.g. Machine Learning Final"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Subject
          </span>

          <input
            type="text"
            value={exam.subject}
            onChange={(event) =>
              onChange({
                subject: event.target.value,
              })
            }
            placeholder="e.g. Artificial Intelligence"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium">
            Exam Date & Time
          </span>

          <input
            type="datetime-local"
            value={exam.date}
            onChange={(event) =>
              onChange({
                date: event.target.value,
              })
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
          />
        </label>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!canSave}
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save Exam
        </button>
      </div>
    </div>
  );
}
