import type { CalendarEvent } from "@/features/calendar/types";
import {
  REMINDERS_STORAGE_KEY,
} from "@/features/reminders/lib/reminders";
import type { Reminder } from "@/features/reminders/types";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

export type CalendarReminderResult =
  | {
      created: true;
      reminder: Reminder;
    }
  | {
      created: false;
      reason: "already-exists";
      reminder: Reminder;
    };

function createReminderId(): string {
  return crypto.randomUUID();
}

export function createReminderFromCalendarEvent(
  event: CalendarEvent,
): CalendarReminderResult {
  let reminders: Reminder[] = [];

  const stored =
    localStorageAdapter.get<unknown>(
      REMINDERS_STORAGE_KEY,
    );

  if (Array.isArray(stored)) {
    reminders = stored as Reminder[];
  }

  const existingReminder = reminders.find(
    (reminder) =>
      reminder.source === "calendar" &&
      reminder.sourceId === event.id,
  );

  if (existingReminder) {
    return {
      created: false,
      reason: "already-exists",
      reminder: existingReminder,
    };
  }

  const now = Date.now();

  const reminder: Reminder = {
    id: createReminderId(),
    title: event.title,
    description: event.description
      ? `Calendar event: ${event.description}`
      : "Created from a calendar event.",
    dueDate: event.date,
    dueTime: event.time,
    priority: "medium",
    completed: false,
    createdAt: now,
    updatedAt: now,
    source: "calendar",
    sourceId: event.id,
  };

  localStorageAdapter.set(
    REMINDERS_STORAGE_KEY,
    [
      reminder,
      ...reminders,
    ],
  );

  emit("reminders:changed");

  return {
    created: true,
    reminder,
  };
}
