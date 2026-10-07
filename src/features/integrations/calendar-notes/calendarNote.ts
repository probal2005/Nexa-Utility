import {
  NOTES_STORAGE_KEY,
} from "@/features/notes/lib/notes";

import type { Note } from "@/features/notes/types";
import type { CalendarEvent } from "@/features/calendar/types";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

export type CalendarNoteResult =
  | {
      created: true;
      note: Note;
    }
  | {
      created: false;
      reason: "already-exists";
      note: Note;
    };

function createNoteId(): string {
  return crypto.randomUUID();
}

export function createNoteFromCalendarEvent(
  event: CalendarEvent,
): CalendarNoteResult {
  let notes: Note[] = [];

  const stored =
    localStorageAdapter.get<unknown>(
      NOTES_STORAGE_KEY,
    );

  if (Array.isArray(stored)) {
    notes = stored as Note[];
  }

  const existingNote = notes.find(
    (note) =>
      note.source === "calendar" &&
      note.sourceId === event.id,
  );

  if (existingNote) {
    return {
      created: false,
      reason: "already-exists",
      note: existingNote,
    };
  }

  const now = Date.now();

  const dateLabel = new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  ).format(
    new Date(
      `${event.date}T00:00:00`,
    ),
  );

  const timeLine = event.time
    ? `Time: ${event.time}`
    : "Time: Not specified";

  const content = [
    `Calendar Event`,
    ``,
    `Date: ${dateLabel}`,
    timeLine,
    ``,
    event.description
      ? `Description:\n${event.description}`
      : "Description: None",
  ].join("\n");

  const note: Note = {
    id: createNoteId(),
    title: event.title,
    content,
    pinned: false,
    createdAt: now,
    updatedAt: now,
    source: "calendar",
    sourceId: event.id,
  };

  localStorageAdapter.set(
    NOTES_STORAGE_KEY,
    [
      note,
      ...notes,
    ],
  );

  emit("notes:changed");

  return {
    created: true,
    note,
  };
}
