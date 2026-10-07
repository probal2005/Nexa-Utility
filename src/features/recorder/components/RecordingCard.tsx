"use client";

import { useState } from "react";
import {
  Download,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  downloadRecording,
  formatRecordingDate,
  formatRecordingDuration,
  formatRecordingSize,
} from "../lib/recorder";

import type { VoiceRecording } from "../types";

type Props = {
  recording: VoiceRecording;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function RecordingCard({
  recording,
  onRename,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(recording.name);

  const saveName = async () => {
    const cleanName = name.trim();

    if (!cleanName) {
      setName(recording.name);
      setEditing(false);
      return;
    }

    await onRename(recording.id, cleanName);

    setEditing(false);
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-4">
        <audio
          controls
          preload="metadata"
          className="w-full"
          src={URL.createObjectURL(recording.blob)}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {editing ? (
              <div className="flex gap-2">
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      void saveName();
                    }

                    if (event.key === "Escape") {
                      setName(recording.name);
                      setEditing(false);
                    }
                  }}
                  autoFocus
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/50"
                />

                <button
                  type="button"
                  onClick={() => void saveName()}
                  className="rounded-lg border border-white/10 px-3 text-xs text-zinc-300 hover:bg-white/[0.05]"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="truncate font-medium text-white">
                  {recording.name}
                </h3>

                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.05] hover:text-white"
                  title="Rename"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
              <span>
                {formatRecordingDuration(recording.duration)}
              </span>
              <span>
                {formatRecordingSize(recording.size)}
              </span>
              <span>
                {formatRecordingDate(recording.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => downloadRecording(recording)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </button>

            <button
              type="button"
              onClick={() => void onDelete(recording.id)}
              className="rounded-lg border border-red-400/10 p-2 text-red-400 transition hover:bg-red-400/10"
              title="Delete recording"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
