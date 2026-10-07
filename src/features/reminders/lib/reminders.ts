import type { Reminder } from "@/features/reminders/types";
import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

export const REMINDERS_STORAGE_KEY =
  STORAGE_KEYS.reminders;

function parseReminderDate(
  dueDate: string,
): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    dueDate,
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (
    Number.isNaN(date.getTime()) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseReminderTimestamp(
  dueDate: string,
  dueTime?: string,
): number | null {
  const date = parseReminderDate(dueDate);

  if (!date) {
    return null;
  }

  const time = dueTime || "23:59";
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);

  if (!timeMatch) {
    return null;
  }

  const hours = Number(timeMatch[1]);
  const minutes = Number(timeMatch[2]);

  if (
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  date.setHours(hours, minutes, 0, 0);

  return date.getTime();
}

export function formatReminderDate(
  dueDate?: string,
  dueTime?: string,
): string {
  if (!dueDate) {
    return "No due date";
  }

  const date = parseReminderDate(dueDate);

  if (!date) {
    return "Invalid due date";
  }

  const formattedDate = new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);

  if (!dueTime) {
    return formattedDate;
  }

  return `${formattedDate} · ${dueTime}`;
}

export function isReminderOverdue(
  reminder: Reminder,
): boolean {
  if (reminder.completed || !reminder.dueDate) {
    return false;
  }

  const dueTimestamp = parseReminderTimestamp(
    reminder.dueDate,
    reminder.dueTime,
  );

  if (dueTimestamp === null) {
    return false;
  }

  return dueTimestamp < Date.now();
}

export function priorityLabel(
  priority: Reminder["priority"],
): string {
  switch (priority) {
    case "high":
      return "High";

    case "medium":
      return "Medium";

    case "low":
      return "Low";
  }
}

export function getStoredReminders(): Reminder[] {
  const stored =
    localStorageAdapter.get<unknown>(
      REMINDERS_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as Reminder[])
    : [];
}

export function saveReminders(
  reminders: Reminder[],
): void {
  localStorageAdapter.set(
    REMINDERS_STORAGE_KEY,
    reminders,
  );
}
