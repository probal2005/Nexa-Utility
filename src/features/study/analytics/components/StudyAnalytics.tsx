"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  ListChecks,
  RefreshCw,
  Timer,
} from "lucide-react";

import {
  formatStudyTime,
  getMaxWeeklyMinutes,
} from "../lib/analytics";

import { useStudyAnalytics } from "../hooks/useStudyAnalytics";

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: typeof Clock3;
  label: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-300">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500">{description}</p>
    </div>
  );
}

export function StudyAnalytics() {
  const {
    stats,
    weeklyStudy,
    hydrated,
    refresh,
  } = useStudyAnalytics();

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
            />
          ))}
        </div>
      </div>
    );
  }

  const maxMinutes = getMaxWeeklyMinutes(weeklyStudy);

  const completionRate =
    stats.plannerTotal === 0
      ? 0
      : Math.round(
          (stats.plannerCompleted / stats.plannerTotal) * 100,
        );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
              <GraduationCap className="h-4 w-4" />
              Study Analytics
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Your academic overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Track study time, sessions, exams and academic tasks from one
              place.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Timer}
          label="Total Study Time"
          value={formatStudyTime(stats.totalStudyMinutes)}
          description={`${stats.completedSessions} completed sessions`}
        />

        <StatCard
          icon={Clock3}
          label="Today"
          value={formatStudyTime(stats.todayStudyMinutes)}
          description="Study time completed today"
        />

        <StatCard
          icon={CalendarDays}
          label="Upcoming Exams"
          value={stats.upcomingExams}
          description="Exams still ahead"
        />

        <StatCard
          icon={ListChecks}
          label="Planner Progress"
          value={`${completionRate}%`}
          description={`${stats.plannerCompleted} of ${stats.plannerTotal} completed`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-6">
            <h2 className="font-semibold text-white">
              Study activity
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Last 7 days
            </p>
          </div>

          <div className="flex h-64 items-end gap-2 sm:gap-4">
            {weeklyStudy.map((item) => {
              const height =
                item.minutes === 0
                  ? 4
                  : Math.max(
                      8,
                      Math.round(
                        (item.minutes / maxMinutes) * 100,
                      ),
                    );

              return (
                <div
                  key={item.date}
                  className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px] text-zinc-500 sm:text-xs">
                    {item.minutes > 0
                      ? formatStudyTime(item.minutes)
                      : ""}
                  </span>

                  <div className="flex h-44 w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-cyan-400/70 transition-all"
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.day}: ${formatStudyTime(item.minutes)}`}
                    />
                  </div>

                  <span className="text-xs text-zinc-500">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Planner
                </h2>
                <p className="text-sm text-zinc-500">
                  Academic workload
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-zinc-500">Pending</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {stats.plannerPending}
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-zinc-500">Completed</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {stats.plannerCompleted}
                </p>
              </div>
            </div>

            <Link
              href="/study/planner"
              className="mt-4 flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              Open Planner
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-white">
                  Attention
                </h2>
                <p className="text-sm text-zinc-500">
                  Items requiring attention
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Overdue planner items
                </span>
                <span className="font-semibold text-white">
                  {stats.plannerOverdue}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  Upcoming exams
                </span>
                <span className="font-semibold text-white">
                  {stats.upcomingExams}
                </span>
              </div>
            </div>

            <Link
              href="/study/exams"
              className="mt-4 flex items-center justify-between rounded-xl border border-white/10 px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              View Exams
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/study/gpa"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
        >
          <BookOpen className="h-5 w-5 text-cyan-400" />
          <h3 className="mt-4 font-semibold text-white">
            GPA Calculator
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Calculate semester GPA and academic performance.
          </p>
        </Link>

        <Link
          href="/study/sessions"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
        >
          <Timer className="h-5 w-5 text-cyan-400" />
          <h3 className="mt-4 font-semibold text-white">
            Study Sessions
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Start focused study sessions and build consistency.
          </p>
        </Link>

        <Link
          href="/study/exams"
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.06]"
        >
          <CalendarDays className="h-5 w-5 text-cyan-400" />
          <h3 className="mt-4 font-semibold text-white">
            Exam Countdown
          </h3>
          <p className="mt-1 text-sm text-zinc-500">
            Keep track of upcoming exams and deadlines.
          </p>
        </Link>
      </section>
    </div>
  );
}
