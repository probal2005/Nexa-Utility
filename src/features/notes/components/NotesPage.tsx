"use client";

import { FileText } from "lucide-react";

import { NoteEditor } from "@/features/notes/components/NoteEditor";
import { NotesSidebar } from "@/features/notes/components/NotesSidebar";
import { useNotes } from "@/features/notes/hooks/useNotes";

export function NotesPage() {
  const {
    filteredNotes,
    selectedNote,
    selectedNoteId,
    search,
    setSearch,
    setSelectedNoteId,
    addNote,
    updateNote,
    togglePin,
    deleteNote,
  } = useNotes();

  const handleCreateNote = () => {
    addNote();
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
              Nexa Utility
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Notes
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
          Capture ideas, reminders, study notes, and anything else you
          want to keep close. Everything is stored locally on this device.
        </p>
      </div>

      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] lg:grid-cols-[320px_minmax(0,1fr)]">
        <NotesSidebar
          notes={filteredNotes}
          selectedNoteId={selectedNoteId}
          search={search}
          onSearchChange={setSearch}
          onSelectNote={setSelectedNoteId}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
        />

        <NoteEditor
          note={selectedNote}
          onUpdate={updateNote}
          onTogglePin={togglePin}
          onDelete={handleDeleteNote}
          onBack={() => setSelectedNoteId(null)}
        />
      </div>
    </div>
  );
}
