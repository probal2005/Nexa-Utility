"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  Timer,
} from "lucide-react";

const studyTools = [
  {
    title: "GPA / CGPA Calculator",
    description:
      "Calculate semester GPA and overall CGPA using subjects, credits, and marks.",
    href: "/study/gpa",
    icon: GraduationCap,
    active: true,
  },
  {
    title: "Percentage & Grade",
    description:
      "Calculate percentages, grades, grade points, and marks needed for a target.",
    href: "/study/grades",
    icon: Calculator,
    active: true,
  },
  {
    title: "Exam Countdown",
    description:
      "Create exams and track exactly how much time remains until each one.",
    href: "/study/exams",
    icon: CalendarClock,
    active: true,
  },
  {
    title: "Study Sessions",
    description:
      "Focus with timed study sessions and keep your local study history.",
    href: "/study/sessions",
    icon: Timer,
    active: true,
  },
  {
    title: "Academic Planner",
    description:
      "Organize assignments, projects, deadlines, and study goals.",
    href: "/study/planner",
    icon: ClipboardList,
    active: true,
  },
  {
    title: "Study Analytics",
    description:
      "Analyze your study time, completed work, subjects, and academic progress.",
    href: "/study/analytics",
    icon: CheckCircle2,
    active: false,
  },
];

export function StudyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm text-zinc-500">
                Nexa Utility
              </p>

              <h1 className="text-2xl font-bold tracking-tight">
                Study Tools
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
            A focused academic workspace for calculating,
            planning, tracking, and improving your study
            workflow.
          </p>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {studyTools.map((tool) => {
            const Icon = tool.icon;

            if (!tool.active) {
              return (
                <div
                  key={tool.title}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 opacity-50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03]">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <h2 className="font-semibold">
                      {tool.title}
                    </h2>

                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wider text-zinc-600">
                      Coming Soon
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {tool.description}
                  </p>
                </div>
              );
            }

            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className="h-5 w-5" />
                  </div>

                  <ArrowRight className="h-4 w-4 text-zinc-700 transition group-hover:translate-x-1 group-hover:text-white" />
                </div>

                <h2 className="mt-5 font-semibold">
                  {tool.title}
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  {tool.description}
                </p>

                <div className="mt-5 text-xs font-medium text-zinc-600 transition group-hover:text-zinc-300">
                  Open tool →
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}
