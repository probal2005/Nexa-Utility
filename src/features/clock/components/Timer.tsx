"use client";

import { useEffect } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { useTimer } from "@/features/clock/hooks/useTimer";

const presets = [
  { label: "1 min", seconds: 60 },
  { label: "5 min", seconds: 300 },
  { label: "10 min", seconds: 600 },
  { label: "25 min", seconds: 1500 },
];

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(remainingSeconds).padStart(2, "0"),
  ].join(":");
}

function getTimerFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(
    window.location.search,
  );

  const value = params.get("timer");

  if (!value) {
    return null;
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }

  return Math.floor(seconds);
}

export function Timer() {
  const {
    remaining,
    running,
    completed,
    start,
    pause,
    reset,
    setTimer,
  } = useTimer(300);

  /*
   * Allow the Universal Command Center to configure
   * the timer through:
   *
   * /clock?timer=1500
   */
  useEffect(() => {
    const seconds = getTimerFromUrl();

    if (seconds === null) {
      return;
    }

    setTimer(seconds);

    /*
     * Remove the command parameter after consuming it.
     * This prevents the same command from being
     * re-applied if the component remounts.
     */
    const url = new URL(window.location.href);

    url.searchParams.delete("timer");

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${
        url.search
          ? url.search
          : ""
      }`,
    );
  }, [setTimer]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div>
        <p className="text-sm font-medium text-white/50">
          Countdown
        </p>

        <h2 className="mt-1 text-xl font-semibold text-white">
          Timer
        </h2>
      </div>

      <div className="py-10 text-center">
        <div
          className="font-mono text-5xl font-semibold tracking-tight text-white sm:text-6xl"
        >
          {formatTime(remaining)}
        </div>

        {completed && (
          <p className="mt-3 text-sm font-medium text-white/60">
            Timer complete
          </p>
        )}
      </div>

      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {presets.map((preset) => (
          <button
            key={preset.seconds}
            type="button"
            onClick={() =>
              setTimer(preset.seconds)
            }
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={
            running ? pause : start
          }
          disabled={
            remaining === 0 &&
            !running
          }
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
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
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
