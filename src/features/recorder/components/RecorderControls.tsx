"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";

import type { RecordingStatus } from "../types";

type Props = {
  status: RecordingStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function RecorderControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop,
  onReset,
}: Props) {
  if (status === "idle" || status === "stopped" || status === "error") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <Play className="h-4 w-4 fill-current" />
          Start Recording
        </button>

        {status === "stopped" && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
    );
  }

  if (status === "requesting") {
    return (
      <div className="flex items-center justify-center">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-400">
          Requesting microphone access...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {status === "recording" ? (
        <button
          type="button"
          onClick={onPause}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
        >
          <Pause className="h-4 w-4" />
          Pause
        </button>
      ) : (
        <button
          type="button"
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
        >
          <Play className="h-4 w-4 fill-current" />
          Resume
        </button>
      )}

      <button
        type="button"
        onClick={onStop}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
      >
        <Square className="h-4 w-4 fill-current" />
        Stop
      </button>
    </div>
  );
}
