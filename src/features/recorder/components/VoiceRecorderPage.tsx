"use client";

import {
  Mic,
  ShieldCheck,
  Trash2,
  Waves,
} from "lucide-react";

import { RecorderControls } from "./RecorderControls";
import { RecordingCard } from "./RecordingCard";

import { useRecordings } from "../hooks/useRecordings";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import {
  formatRecordingDuration,
  getDefaultRecordingName,
  createRecordingId,
} from "../lib/recorder";

import type { VoiceRecording } from "../types";

export function VoiceRecorderPage() {
  const {
    recordings,
    hydrated,
    addRecording,
    renameRecording,
    deleteRecording,
    clearRecordings,
  } = useRecordings();

  const handleRecordingComplete = async (
    blob: Blob,
    duration: number,
  ) => {
    const createdAt = Date.now();

    const recording: VoiceRecording = {
      id: createRecordingId(),
      name: getDefaultRecordingName(createdAt),
      blob,
      mimeType: blob.type || "audio/webm",
      duration,
      size: blob.size,
      createdAt,
    };

    await addRecording(recording);
  };

  const {
    status,
    duration,
    error,
    start,
    pause,
    resume,
    stop,
    reset,
  } = useVoiceRecorder(handleRecordingComplete);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <Mic className="h-4 w-4" />
            Voice Recorder
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Record your voice
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Record audio directly in your browser. Your recordings stay
            locally on this device.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div
            className={`mb-6 flex h-28 w-28 items-center justify-center rounded-full border ${
              status === "recording"
                ? "border-red-400/40 bg-red-400/10 text-red-400"
                : "border-white/10 bg-white/[0.04] text-zinc-400"
            }`}
          >
            <Waves
              className={`h-12 w-12 ${
                status === "recording"
                  ? "animate-pulse"
                  : ""
              }`}
            />
          </div>

          <div className="font-mono text-4xl font-semibold tracking-wider text-white">
            {formatRecordingDuration(duration)}
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            {status === "recording"
              ? "Recording..."
              : status === "paused"
                ? "Paused"
                : status === "requesting"
                  ? "Connecting to microphone..."
                  : "Ready to record"}
          </p>

          <div className="mt-8">
            <RecorderControls
              status={status}
              onStart={() => void start()}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              onReset={reset}
            />
          </div>

          {error && (
            <div className="mt-5 max-w-lg rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />

          <div>
            <h2 className="text-sm font-semibold text-white">
              Privacy
            </h2>
            <p className="mt-1 text-sm leading-6 text-zinc-500">
              Nexa Utility uses your browser microphone permission. Audio
              recordings are stored locally in IndexedDB and are not uploaded
              to a server by this feature.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recordings
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {recordings.length}{" "}
              {recordings.length === 1 ? "recording" : "recordings"}
            </p>
          </div>

          {recordings.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Delete all saved recordings?",
                  )
                ) {
                  void clearRecordings();
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-red-400/10 px-3 py-2 text-xs text-red-400 transition hover:bg-red-400/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear All
            </button>
          )}
        </div>

        {!hydrated ? (
          <div className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ) : recordings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <Mic className="mx-auto h-8 w-8 text-zinc-600" />

            <h3 className="mt-4 font-medium text-white">
              No recordings yet
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-zinc-500">
              Start your first recording and it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((recording) => (
              <RecordingCard
                key={recording.id}
                recording={recording}
                onRename={renameRecording}
                onDelete={deleteRecording}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
