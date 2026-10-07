"use client";

import {
  FileText,
  Pin,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { formatNoteDate, getNotePreview } from "@/features/notes/lib/notes";
import type { Note } from "@/features/notes/types";

type Props = {
  notes: Note[];
  selectedNoteId: string | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectNote: (id: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
};

export function NotesSidebar({
  notes,
  selectedNoteId,
  search,
  onSearchChange,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
}: Props) {
  return (
    <aside className="flex min-h-[500px] flex-col border-b border-white/10 bg-white/[0.025] lg:min-h-0 lg:border-b-0 lg:border-r">
      <div className="border-b border-white/[0.07] p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/25">
              Workspace
            </p>

            <h2 className="mt-1 font-semibold text-white">
              My Notes
            </h2>
          </div>

          <button
            type="button"
            onClick={onCreateNote}
            aria-label="Create new note"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black transition hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search notes..."
            className="h-10 w-full rounded-xl border border-white/10 bg-black/20 pl-9 pr-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {notes.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <FileText className="mb-3 h-6 w-6 text-white/15" />

            <p className="text-sm text-white/35">
              No notes found.
            </p>

            <p className="mt-1 text-xs leading-5 text-white/20">
              Create a note or try another search.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {notes.map((note) => {
              const selected = note.id === selectedNoteId;

              return (
                <div
                  key={note.id}
                  className={[
                    "group relative rounded-xl transition",
                    selected
                      ? "bg-white/[0.08]"
                      : "hover:bg-white/[0.045]",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => onSelectNote(note.id)}
                    className="w-full min-w-0 p-3 pr-10 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {note.pinned && (
                        <Pin className="h-3 w-3 shrink-0 fill-white/40 text-white/40" />
                      )}

                      <p className="truncate text-sm font-medium text-white">
                        {note.title || "Untitled note"}
                      </p>
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/30">
                      {getNotePreview(note.content)}
                    </p>

                    <p className="mt-2 text-[10px] text-white/20">
                      {formatNoteDate(note.updatedAt)}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteNote(note.id)}
                    aria-label={`Delete ${note.title || "note"}`}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-white/0 transition group-hover:text-white/20 hover:!bg-white/[0.07] hover:!text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
