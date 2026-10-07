import type { Reminder } from "@/features/reminders/types";
import type { CalendarEvent } from "@/features/calendar/types";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

const CALENDAR_STORAGE_KEY =
  "nexa-utility-calendar-events";

type CreateCalendarEventResult =
  | {
      created: true;
      event: CalendarEvent;
    }
  | {
      created: false;
      reason: "missing-date" | "already-exists";
      event?: CalendarEvent;
    };

function loadCalendarEvents(): CalendarEvent[] {
  const stored =
    localStorageAdapter.get<unknown>(
      CALENDAR_STORAGE_KEY,
    );

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored as CalendarEvent[];
}

export function createCalendarEventFromReminder(
  reminder: Reminder,
): CreateCalendarEventResult {
  if (typeof window === "undefined") {
    return {
      created: false,
      reason: "missing-date",
    };
  }

  if (!reminder.dueDate) {
    return {
      created: false,
      reason: "missing-date",
    };
  }

  const events = loadCalendarEvents();

  const existingEvent = events.find(
    (event) =>
      (event as CalendarEvent & {
        source?: string;
        sourceId?: string;
      }).source === "reminder" &&
      (event as CalendarEvent & {
        source?: string;
        sourceId?: string;
      }).sourceId === reminder.id,
  );

  if (existingEvent) {
    return {
      created: false,
      reason: "already-exists",
      event: existingEvent,
    };
  }

  const now = Date.now();

  const event: CalendarEvent & {
    source: "reminder";
    sourceId: string;
  } = {
    id: crypto.randomUUID(),
    date: reminder.dueDate,
    title: reminder.title,
    time: reminder.dueTime,
    description: reminder.description,
    createdAt: now,
    source: "reminder",
    sourceId: reminder.id,
  };

  events.push(event);

  localStorageAdapter.set(
    CALENDAR_STORAGE_KEY,
    events,
  );

  emit("calendar:changed");

  return {
    created: true,
    event,
  };
}
