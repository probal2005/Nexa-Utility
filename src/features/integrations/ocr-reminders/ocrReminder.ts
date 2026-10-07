import type { OCRResult } from "@/features/scanner/ocr/types";
import type { Reminder } from "@/features/reminders/types";
import { REMINDERS_STORAGE_KEY } from "@/features/reminders/lib/reminders";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

import {
  parseSmartDateTime,
} from "@/features/integrations/smart-datetime/smartDateTime";

import {
  extractSmartReminderDetails,
} from "@/features/integrations/smart-reminder/smartReminder";

type CreateReminderResponse =
  | {
      created: true;
      reminder: Reminder;
    }
  | {
      created: false;
      reason: "already-exists" | "empty";
      reminder?: Reminder;
    };

function loadReminders(): Reminder[] {
  const stored =
    localStorageAdapter.get<unknown>(
      REMINDERS_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as Reminder[])
    : [];
}

function saveReminders(
  reminders: Reminder[],
): void {
  localStorageAdapter.set(
    REMINDERS_STORAGE_KEY,
    reminders,
  );

  emit("reminders:changed");
}

export function createReminderFromOCRResult(
  result: OCRResult,
): CreateReminderResponse {
  const text = result.text.trim();

  if (!text) {
    return {
      created: false,
      reason: "empty",
    };
  }

  const reminders = loadReminders();

  const existing = reminders.find(
    (reminder) =>
      reminder.source === "ocr" &&
      reminder.sourceId ===
        String(result.createdAt),
  );

  if (existing) {
    return {
      created: false,
      reason: "already-exists",
      reminder: existing,
    };
  }

  const details =
    extractSmartReminderDetails(text);

  const dateTime =
    parseSmartDateTime(text);

  const now = Date.now();

  const reminder: Reminder = {
    id: crypto.randomUUID(),
    title: details.title,
    description: text,
    dueDate: dateTime.dueDate,
    dueTime: dateTime.dueTime,
    priority: details.priority,
    completed: false,
    createdAt: now,
    updatedAt: now,
    source: "ocr",
    sourceId: String(result.createdAt),
  };

  saveReminders([
    reminder,
    ...reminders,
  ]);

  return {
    created: true,
    reminder,
  };
}
