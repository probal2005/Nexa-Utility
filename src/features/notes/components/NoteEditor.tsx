"use client";

import {
  ArrowLeft,
  FileText,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";

import { formatNoteDate } from "@/features/notes/lib/notes";
import type { Note } from "@/features/notes/types";

type Props = {
  note: Note | null;
  onUpdate: (
    id: string,
    updates: Partial<Pick<Note, "title" | "content">>,
  ) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
};

export function NoteEditor({
  note,
  onUpdate,
  onTogglePin,
  onDelete,
  onBack,
}: Props) {
  if (!note) {
    return (
      <section className="flex min-h-[500px] flex-1 items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <FileText className="mx-auto mb-4 h-8 w-8 text-white/15" />

          <h3 className="text-lg font-semibold text-white">
            Select a note
          </h3>

          <p className="mt-2 text-sm leading-6 text-white/30">
            Choose a note from the list or create a new one to start
            writing.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[500px] flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 items-center gap-2 rounded-xl px-2 text-xs text-white/35 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Notes
        </button>

        <div className="hidden text-xs text-white/20 lg:block">
          Updated {formatNoteDate(note.updatedAt)}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTogglePin(note.id)}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition hover:bg-white/[0.06] hover:text-white"
          >
            {note.pinned ? (
              <Pin className="h-4 w-4 fill-white/60" />
            ) : (
              <PinOff className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(note.id)}
            aria-label="Delete note"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/30 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <input
          value={note.title}
          onChange={(event) =>
            onUpdate(note.id, {
              title: event.target.value,
            })
          }
          placeholder="Untitled note"
          className="w-full border-0 bg-transparent text-2xl font-semibold tracking-tight text-white outline-none placeholder:text-white/20 sm:text-3xl"
        />

        <div className="mt-3 text-xs text-white/20 lg:hidden">
          Updated {formatNoteDate(note.updatedAt)}
        </div>

        <textarea
          value={note.content}
          onChange={(event) =>
            onUpdate(note.id, {
              content: event.target.value,
            })
          }
          placeholder="Start writing..."
          className="mt-8 min-h-[360px] flex-1 resize-none border-0 bg-transparent text-sm leading-7 text-white/65 outline-none placeholder:text-white/20 sm:text-base"
        />

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[10px] text-white/20">
          <span>
            {note.content.length} characters
          </span>

          <span>
            Saved locally
          </span>
        </div>
      </div>
    </section>
  );
}
