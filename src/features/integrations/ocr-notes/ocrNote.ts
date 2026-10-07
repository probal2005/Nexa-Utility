import {
  NOTES_STORAGE_KEY,
} from "@/features/notes/lib/notes";

import type { Note } from "@/features/notes/types";
import type { OCRResult } from "@/features/scanner/ocr/types";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

export type OCRNoteResult =
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

function loadNotes(): Note[] {
  const stored =
    localStorageAdapter.get<unknown>(
      NOTES_STORAGE_KEY,
    );

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored as Note[];
}

export function createNoteFromOCRResult(
  result: OCRResult,
): OCRNoteResult {
  const notes = loadNotes();

  const existingNote = notes.find(
    (note) =>
      note.source === "ocr" &&
      note.sourceId ===
        String(result.createdAt),
  );

  if (existingNote) {
    return {
      created: false,
      reason: "already-exists",
      note: existingNote,
    };
  }

  const now = Date.now();

  const content = [
    "OCR Scan",
    "",
    `Scanned: ${new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(new Date(result.createdAt))}`,
    `OCR Confidence: ${Math.round(
      result.confidence,
    )}%`,
    "",
    "Extracted Text",
    "--------------",
    result.text,
  ].join("\n");

  const note: Note = {
    id: createNoteId(),
    title: `OCR Scan — ${new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    ).format(new Date(result.createdAt))}`,
    content,
    pinned: false,
    createdAt: now,
    updatedAt: now,
    source: "ocr",
    sourceId: String(result.createdAt),
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
