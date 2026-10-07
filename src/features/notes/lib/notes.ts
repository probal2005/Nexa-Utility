import { STORAGE_KEYS } from "@/lib/storage";

export const NOTES_STORAGE_KEY =
  STORAGE_KEYS.notes;

export function formatNoteDate(
  timestamp: number,
): string {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getNotePreview(
  content: string,
): string {
  const clean = content
    .replace(/\s+/g, " ")
    .trim();

  if (!clean) {
    return "No content";
  }

  return clean.length > 100
    ? `${clean.slice(0, 100)}...`
    : clean;
}
