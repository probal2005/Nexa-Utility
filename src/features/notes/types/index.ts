export type NoteSource =
  | "manual"
  | "calendar"
  | "ocr";

export type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;

  /**
   * Identifies where the note came from.
   * Existing notes without a source remain valid.
   */
  source?: NoteSource;

  /**
   * ID of the originating item.
   *
   * Calendar:
   * CalendarEvent ID.
   *
   * OCR:
   * OCR result creation timestamp.
   */
  sourceId?: string;
};
