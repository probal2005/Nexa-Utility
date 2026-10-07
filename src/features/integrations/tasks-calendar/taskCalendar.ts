import type { CalendarEvent } from "@/features/calendar/types";
import type { Task } from "@/features/tasks/types";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

const CALENDAR_STORAGE_KEY =
  "nexa-utility-calendar-events";

type CreateTaskCalendarResponse =
  | {
      created: true;
      event: CalendarEvent;
    }
  | {
      created: false;
      reason: "already-exists" | "missing-date";
      event?: CalendarEvent;
    };

function loadEvents(): CalendarEvent[] {
  const stored =
    localStorageAdapter.get<unknown>(
      CALENDAR_STORAGE_KEY,
    );

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored as CalendarEvent[];
}

function saveEvents(
  events: CalendarEvent[],
): void {
  localStorageAdapter.set(
    CALENDAR_STORAGE_KEY,
    events,
  );

  emit("calendar:changed");
}

export function createCalendarEventFromTask(
  task: Task,
): CreateTaskCalendarResponse {
  if (!task.dueDate) {
    return {
      created: false,
      reason: "missing-date",
    };
  }

  const events = loadEvents();

  const existing = events.find(
    (event) =>
      event.source === "task" &&
      event.sourceId === task.id,
  );

  if (existing) {
    return {
      created: false,
      reason: "already-exists",
      event: existing,
    };
  }

  const event: CalendarEvent = {
    id: crypto.randomUUID(),
    date: task.dueDate,
    title: task.title,
    description:
      task.description ||
      `Task: ${task.title}`,
    createdAt: Date.now(),
    source: "task",
    sourceId: task.id,
  };

  saveEvents([
    ...events,
    event,
  ]);

  return {
    created: true,
    event,
  };
}

export function getCalendarEventForTask(
  taskId: string,
): CalendarEvent | null {
  const events = loadEvents();

  return (
    events.find(
      (event) =>
        event.source === "task" &&
        event.sourceId === taskId,
    ) ?? null
  );
}
