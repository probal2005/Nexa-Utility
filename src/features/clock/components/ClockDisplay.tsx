"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Globe2 } from "lucide-react";

import { useClock } from "@/features/clock/hooks/useClock";
import type { ClockFormat } from "@/features/clock/types";

function getTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Local Time";
  }
}

export function ClockDisplay() {
  const now = useClock();
  const [format, setFormat] = useState<ClockFormat>("12h");

  const time = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: format === "12h",
      }).format(now),
    [now, format],
  );

  const date = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now),
    [now],
  );

  const timezone = useMemo(() => getTimeZone(), []);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/50">Current time</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Local Clock
          </h2>
        </div>

        <button
          type="button"
          onClick={() =>
            setFormat((current) => (current === "12h" ? "24h" : "12h"))
          }
          className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          {format === "12h" ? "12-hour" : "24-hour"}
        </button>
      </div>

      <div className="py-8 text-center">
        <div className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
          {time}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-white/50">
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {date}
          </span>

          <span className="hidden h-4 w-px bg-white/10 sm:block" />

          <span className="inline-flex items-center gap-2">
            <Globe2 className="h-4 w-4" />
            {timezone}
          </span>
        </div>
      </div>
    </div>
  );
}