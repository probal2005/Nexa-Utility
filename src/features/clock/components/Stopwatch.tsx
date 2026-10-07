"use client";

import { Pause, Play, RotateCcw } from "lucide-react";

import { useStopwatch } from "@/features/clock/hooks/useStopwatch";

function formatMilliseconds(milliseconds: number) {
  const totalCentiseconds = Math.floor(milliseconds / 10);

  const hours = Math.floor(totalCentiseconds / 360000);
  const minutes = Math.floor((totalCentiseconds % 360000) / 6000);
  const seconds = Math.floor((totalCentiseconds % 6000) / 100);
  const centiseconds = totalCentiseconds % 100;

  return {
    main: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`,
    fraction: String(centiseconds).padStart(2, "0"),
  };
}

export function Stopwatch() {
  const { elapsed, running, start, pause, reset } = useStopwatch();
  const display = formatMilliseconds(elapsed);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div>
        <p className="text-sm font-medium text-white/50">Precision timer</p>
        <h2 className="mt-1 text-xl font-semibold text-white">Stopwatch</h2>
      </div>

      <div className="py-10 text-center">
        <div className="font-mono text-5xl font-semibold tracking-tight text-white sm:text-6xl">
          {display.main}
          <span className="text-2xl text-white/40">.{display.fraction}</span>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={running ? pause : start}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          {running ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start
            </>
          )}
        </button>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}