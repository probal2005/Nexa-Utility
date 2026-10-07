"use client";

import { AlarmClock, Timer as TimerIcon } from "lucide-react";

import { ClockDisplay } from "@/features/clock/components/ClockDisplay";
import { Stopwatch } from "@/features/clock/components/Stopwatch";
import { Timer } from "@/features/clock/components/Timer";

export function ClockPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <AlarmClock className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Clock
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Time, stopwatch and countdown tools in one place.
            </p>
          </div>
        </div>
      </div>

      <ClockDisplay />

      <div className="grid gap-6 lg:grid-cols-2">
        <Stopwatch />

        <div>
          <div className="mb-4 flex items-center gap-2 text-sm text-white/50">
            <TimerIcon className="h-4 w-4" />
            Countdown
          </div>

          <Timer />
        </div>
      </div>
    </div>
  );
}