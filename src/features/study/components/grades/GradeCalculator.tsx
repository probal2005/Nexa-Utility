'use client';

import {
  Award,
  Calculator,
  Percent,
  Target,
} from 'lucide-react';
import { DEFAULT_GRADE_SCALE } from '@/features/study/lib/study';
import { useGradeCalculator } from '@/features/study/hooks/useGradeCalculator';

function number(value: number, digits = 2) {
  return Number.isFinite(value)
    ? value.toFixed(digits)
    : '0.00';
}

export function GradeCalculator() {
  const {
    marks,
    setMarks,
    maxMarks,
    setMaxMarks,
    targetPercentage,
    setTargetPercentage,
    percentageResult,
    gradeResult,
    marksNeeded,
  } = useGradeCalculator();

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4" />
            Study Tools
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Percentage & Grade Calculator
          </h1>

          <p className="mt-2 max-w-2xl text-muted-foreground">
            Calculate your percentage, grade, grade point,
            and the marks required to reach a target percentage.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Percent className="h-4 w-4" />
              Percentage
            </div>

            <div className="text-4xl font-bold">
              {number(percentageResult.percentage)}%
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {marks} / {maxMarks} marks
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="h-4 w-4" />
              Grade
            </div>

            <div className="text-4xl font-bold">
              {gradeResult.grade}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              Grade Point: {number(gradeResult.gradePoint, 1)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Target className="h-4 w-4" />
              Target
            </div>

            <div className="text-4xl font-bold">
              {number(marksNeeded)}
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              marks needed for {targetPercentage}%
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              Percentage Calculator
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your obtained marks and maximum marks.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Marks Obtained
                </span>

                <input
                  type="number"
                  min="0"
                  value={marks}
                  onChange={(event) =>
                    setMarks(
                      Math.max(
                        0,
                        Number(event.target.value),
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Maximum Marks
                </span>

                <input
                  type="number"
                  min="1"
                  value={maxMarks}
                  onChange={(event) =>
                    setMaxMarks(
                      Math.max(
                        1,
                        Number(event.target.value),
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>

              <div className="rounded-xl bg-muted/50 p-4">
                <div className="text-sm text-muted-foreground">
                  Formula
                </div>

                <div className="mt-2 font-mono text-sm">
                  Percentage = (Marks ÷ Maximum Marks) × 100
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              Target Percentage
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Find how many marks you need to reach your target.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">
                  Target Percentage
                </span>

                <input
                  type="number"
                  min="0"
                  max="100"
                  value={targetPercentage}
                  onChange={(event) =>
                    setTargetPercentage(
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Number(event.target.value),
                        ),
                      ),
                    )
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </label>

              <div className="rounded-xl border border-border p-5">
                <div className="text-sm text-muted-foreground">
                  Additional marks required
                </div>

                <div className="mt-2 text-3xl font-bold">
                  {number(marksNeeded)}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  to reach {targetPercentage}% from your
                  current {number(percentageResult.percentage)}%.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              Grade Scale
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current Nexa Utility academic grade scale.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="px-4 py-3 font-medium">
                    Grade
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Percentage
                  </th>
                  <th className="px-4 py-3 font-medium">
                    Grade Point
                  </th>
                </tr>
              </thead>

              <tbody>
                {DEFAULT_GRADE_SCALE.map((scale) => (
                  <tr
                    key={scale.grade}
                    className={`border-b border-border last:border-0 ${
                      gradeResult.grade === scale.grade
                        ? 'bg-muted/50'
                        : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold">
                      {scale.grade}
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {scale.minPercentage}% –{' '}
                      {scale.maxPercentage}%
                    </td>

                    <td className="px-4 py-3 text-sm">
                      {scale.gradePoint}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
