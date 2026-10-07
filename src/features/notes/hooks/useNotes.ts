"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  localStorageAdapter,
} from "@/lib/storage";

import {
  emit,
  on,
} from "@/lib/events";

import {
  NOTES_STORAGE_KEY,
} from "@/features/notes/lib/notes";

import type { Note } from "@/features/notes/types";

function createNote(): Note {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: "Untitled note",
    content: "",
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

function loadNotes(): Note[] {
  const stored =
    localStorageAdapter.get<unknown>(
      NOTES_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as Note[])
    : [];
}

export function useNotes() {
  const [notes, setNotes] =
    useState<Note[]>([]);

  const [
    selectedNoteId,
    setSelectedNoteId,
  ] = useState<string | null>(
    null,
  );

  const [search, setSearch] =
    useState("");

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const loadedNotes =
      loadNotes();

    setNotes(loadedNotes);

    if (loadedNotes.length > 0) {
      setSelectedNoteId(
        loadedNotes[0].id,
      );
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorageAdapter.set(
      NOTES_STORAGE_KEY,
      notes,
    );
  }, [notes, hydrated]);

  useEffect(() => {
    const handleExternalChange =
      () => {
        const loadedNotes =
          loadNotes();

        setNotes(loadedNotes);

        setSelectedNoteId(
          (currentId) => {
            if (
              currentId &&
              loadedNotes.some(
                (note) =>
                  note.id === currentId,
              )
            ) {
              return currentId;
            }

            return (
              loadedNotes[0]?.id ??
              null
            );
          },
        );
      };

    const unsubscribe =
      on(
        "notes:changed",
        handleExternalChange,
      );

    return unsubscribe;
  }, []);

  const selectedNote = useMemo(
    () =>
      notes.find(
        (note) =>
          note.id ===
          selectedNoteId,
      ) ?? null,
    [
      notes,
      selectedNoteId,
    ],
  );

  const filteredNotes =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      if (!normalizedSearch) {
        return notes;
      }

      return notes.filter(
        (note) =>
          note.title
            .toLowerCase()
            .includes(
              normalizedSearch,
            ) ||
          note.content
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
      );
    }, [notes, search]);

  const addNote = () => {
    const note =
      createNote();

    setNotes(
      (current) => [
        note,
        ...current,
      ],
    );

    setSelectedNoteId(
      note.id,
    );

    emit("notes:changed");
  };

  const updateNote = (
    id: string,
    updates: Partial<Note>,
  ) => {
    setNotes(
      (current) =>
        current.map(
          (note) =>
            note.id === id
              ? {
                  ...note,
                  ...updates,
                  updatedAt:
                    Date.now(),
                }
              : note,
        ),
    );

    emit("notes:changed");
  };

  const deleteNote = (
    id: string,
  ) => {
    setNotes(
      (current) =>
        current.filter(
          (note) =>
            note.id !== id,
        ),
    );

    setSelectedNoteId(
      (currentId) =>
        currentId === id
          ? null
          : currentId,
    );

    emit("notes:changed");
  };

  const togglePin = (
    id: string,
  ) => {
    setNotes(
      (current) =>
        current.map(
          (note) =>
            note.id === id
              ? {
                  ...note,
                  pinned:
                    !note.pinned,
                  updatedAt:
                    Date.now(),
                }
              : note,
        ),
    );

    emit("notes:changed");
  };

  return {
    notes,
    filteredNotes,
    selectedNote,
    selectedNoteId,
    search,
    hydrated,
    setSearch,
    setSelectedNoteId,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  };
}
