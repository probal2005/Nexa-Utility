'use client';

import {
  BookOpen,
  Calculator,
  Plus,
  RotateCcw,
  Trash2,
  Trophy,
} from 'lucide-react';
import { useGPA } from '@/features/study/hooks/useGPA';

function formatNumber(value: number, digits = 2) {
  return Number.isFinite(value) ? value.toFixed(digits) : '0.00';
}

export function GPACalculator() {
  const {
    subjects,
    calculatedSubjects,
    result,
    addSubject,
    updateSubject,
    removeSubject,
    reset,
  } = useGPA();

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Calculator className="h-4 w-4" />
              Study Tools
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              GPA Calculator
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Add your subjects, credits, and marks to calculate
              your semester GPA automatically.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition hover:bg-muted"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <Trophy className="h-4 w-4" />
              Semester GPA
            </div>

            <div className="text-4xl font-bold">
              {formatNumber(result.gpa)}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Total Credits
            </div>

            <div className="text-4xl font-bold">
              {formatNumber(result.totalCredits, 0)}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Subjects
            </div>

            <div className="text-4xl font-bold">
              {subjects.length}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 text-sm text-muted-foreground">
              Weighted Points
            </div>

            <div className="text-4xl font-bold">
              {formatNumber(result.totalGradePoints)}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <h2 className="font-semibold">
                Subject Details
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              GPA is calculated using credit-weighted grade points.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="px-5 py-4 font-medium">
                    Subject
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Credits
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Marks
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Max Marks
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Percentage
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Grade
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Point
                  </th>
                  <th className="px-5 py-4 font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {calculatedSubjects.map((subject) => (
                  <tr
                    key={subject.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <input
                        type="text"
                        value={subject.name}
                        onChange={(event) =>
                          updateSubject(subject.id, {
                            name: event.target.value,
                          })
                        }
                        placeholder="e.g. Machine Learning"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={subject.credits}
                        onChange={(event) =>
                          updateSubject(subject.id, {
                            credits: Math.max(
                              0,
                              Number(event.target.value),
                            ),
                          })
                        }
                        className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="0"
                        value={subject.marks}
                        onChange={(event) =>
                          updateSubject(subject.id, {
                            marks: Math.max(
                              0,
                              Number(event.target.value),
                            ),
                          })
                        }
                        className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </td>

                    <td className="px-5 py-4">
                      <input
                        type="number"
                        min="1"
                        value={subject.maxMarks}
                        onChange={(event) =>
                          updateSubject(subject.id, {
                            maxMarks: Math.max(
                              1,
                              Number(event.target.value),
                            ),
                          })
                        }
                        className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {formatNumber(subject.percentage)}%
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg border border-border px-3 py-1.5 text-sm font-semibold">
                        {subject.grade}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold">
                      {formatNumber(subject.gradePoint, 1)}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          removeSubject(subject.id)
                        }
                        aria-label={`Delete ${subject.name || 'subject'}`}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end border-t border-border p-5">
            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm transition hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
              Add Another Subject
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold">
            How the GPA is calculated
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Each subject contributes its grade point multiplied by
            its credit value. The total weighted grade points are
            divided by the total number of credits.
          </p>

          <div className="mt-4 rounded-xl bg-muted/50 p-4 font-mono text-sm">
            GPA = Σ(Grade Point × Credits) ÷ Σ(Credits)
          </div>
        </section>
      </div>
    </main>
  );
}
