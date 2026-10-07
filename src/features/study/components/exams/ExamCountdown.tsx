'use client';

import {
  CalendarClock,
  GraduationCap,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import type { Exam } from '@/features/study/types';
import { useExams } from '@/features/study/hooks/useExams';
import { ExamForm } from './ExamForm';
import { ExamCard } from './ExamCard';

function createDraftExam(): Exam {
  const date = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000,
  );

  date.setHours(10, 0, 0, 0);

  return {
    id: crypto.randomUUID(),
    name: '',
    subject: '',
    date: date.toISOString().slice(0, 16),
    createdAt: Date.now(),
  };
}

export function ExamCountdown() {
  const {
    exams,
    filteredExams,
    search,
    setSearch,
    upcomingCount,
    completedCount,
    addExam,
    updateExam,
    deleteExam,
    clearCompleted,
  } = useExams();

  const [editingExam, setEditingExam] =
    useState<Exam | null>(null);

  function startNewExam() {
    setEditingExam(createDraftExam());
  }

  function saveExam() {
    if (!editingExam) {
      return;
    }

    if (
      !editingExam.name.trim() ||
      !editingExam.subject.trim() ||
      !editingExam.date
    ) {
      return;
    }

    const existing = exams.some(
      (exam) => exam.id === editingExam.id,
    );

    if (existing) {
      updateExam(editingExam.id, editingExam);
    } else {
      addExam(editingExam);
    }

    setEditingExam(null);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              Study Tools
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              Exam Countdown
            </h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Keep every upcoming exam visible and know exactly
              how much time remains.
            </p>
          </div>

          <button
            type="button"
            onClick={startNewExam}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add Exam
          </button>
        </header>

        {editingExam && (
          <ExamForm
            exam={editingExam}
            onChange={(updates) =>
              setEditingExam((current) =>
                current
                  ? { ...current, ...updates }
                  : current,
              )
            }
            onSave={saveExam}
            onCancel={() => setEditingExam(null)}
          />
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">
              Total Exams
            </div>

            <div className="mt-2 text-3xl font-bold">
              {exams.length}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">
              Upcoming
            </div>

            <div className="mt-2 text-3xl font-bold">
              {upcomingCount}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="text-sm text-muted-foreground">
              Completed
            </div>

            <div className="mt-2 text-3xl font-bold">
              {completedCount}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search exams or subjects..."
              className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm hover:bg-muted"
            >
              <Trash2 className="h-4 w-4" />
              Clear Completed
            </button>
          )}
        </section>

        {filteredExams.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-border p-12 text-center">
            <CalendarClock className="mx-auto h-10 w-10 text-muted-foreground" />

            <h2 className="mt-4 text-lg font-semibold">
              {exams.length === 0
                ? 'No exams yet'
                : 'No matching exams'}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {exams.length === 0
                ? 'Add your next exam and Nexa Utility will keep a live countdown for you.'
                : 'Try a different exam name or subject.'}
            </p>

            {exams.length === 0 && (
              <button
                type="button"
                onClick={startNewExam}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <Plus className="h-4 w-4" />
                Add Your First Exam
              </button>
            )}
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {filteredExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onEdit={() => setEditingExam(exam)}
                onDelete={() => deleteExam(exam.id)}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
