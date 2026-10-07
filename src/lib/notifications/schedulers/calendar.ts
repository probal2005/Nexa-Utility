import { getNotifications, notify } from "@/lib/notifications";
import { localStorageAdapter, STORAGE_KEYS } from "@/lib/storage";
import type { CalendarEvent } from "@/features/calendar/types";

const CALENDAR_NOTIFICATION_TYPE = "calendar";

function getStoredCalendarEvents(): CalendarEvent[] {
  const stored = localStorageAdapter.get<unknown>(
    STORAGE_KEYS.calendarEvents,
  );

  return Array.isArray(stored)
    ? (stored as CalendarEvent[])
    : [];
}

function getCalendarEventTimestamp(
  event: CalendarEvent,
): number | null {
  if (!event.date) {
    return null;
  }

  const time = event.time || "00:00";

  const timestamp = new Date(
    `${event.date}T${time}:00`,
  ).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return timestamp;
}

function hasNotificationForEvent(
  eventId: string,
): boolean {
  return getNotifications().some(
    (notification) =>
      notification.type === CALENDAR_NOTIFICATION_TYPE &&
      notification.metadata?.calendarEventId === eventId,
  );
}

function createCalendarNotification(
  event: CalendarEvent,
  eventTimestamp: number,
): void {
  if (hasNotificationForEvent(event.id)) {
    return;
  }

  const isOverdue = eventTimestamp < Date.now();

  notify({
    type: "calendar",
    title: isOverdue
      ? `Calendar event passed: ${event.title}`
      : event.title,
    message: isOverdue
      ? "This calendar event has passed."
      : event.description || "Your calendar event is due now.",
    priority: isOverdue ? "high" : "normal",
    scheduledFor: eventTimestamp,
    action: {
      label: "Open calendar",
      href: "/calendar",
    },
    metadata: {
      calendarEventId: event.id,
      calendarEventDate: event.date,
      calendarEventTime: event.time,
      calendarEventSource: event.source,
      calendarEventSourceId: event.sourceId,
    },
  });
}

export function processDueCalendarEvents(): number {
  const events = getStoredCalendarEvents();
  const now = Date.now();

  let created = 0;

  for (const event of events) {
    const eventTimestamp =
      getCalendarEventTimestamp(event);

    if (
      eventTimestamp === null ||
      eventTimestamp > now
    ) {
      continue;
    }

    if (hasNotificationForEvent(event.id)) {
      continue;
    }

    createCalendarNotification(
      event,
      eventTimestamp,
    );

    created += 1;
  }

  return created;
}
