import { getNotifications, notify } from "@/lib/notifications";
import { getStoredReminders } from "@/features/reminders/lib/reminders";
import type { Reminder } from "@/features/reminders/types";

const REMINDER_NOTIFICATION_TYPE = "reminder";

function getReminderTimestamp(reminder: Reminder): number | null {
  if (!reminder.dueDate) {
    return null;
  }

  const time = reminder.dueTime || "23:59";
  const timestamp = new Date(
    `${reminder.dueDate}T${time}:00`,
  ).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return timestamp;
}

function hasNotificationForReminder(reminderId: string): boolean {
  return getNotifications().some(
    (notification) =>
      notification.type === REMINDER_NOTIFICATION_TYPE &&
      notification.metadata?.reminderId === reminderId,
  );
}

function getNotificationPriority(
  priority: Reminder["priority"],
): "low" | "normal" | "high" | "urgent" {
  switch (priority) {
    case "high":
      return "urgent";

    case "medium":
      return "normal";

    case "low":
    default:
      return "low";
  }
}

function createReminderNotification(
  reminder: Reminder,
  dueTimestamp: number,
): void {
  if (hasNotificationForReminder(reminder.id)) {
    return;
  }

  const isOverdue = dueTimestamp < Date.now();

  notify({
    type: "reminder",
    title: isOverdue
      ? `Reminder overdue: ${reminder.title}`
      : reminder.title,
    message: isOverdue
      ? "This reminder is overdue."
      : "Your reminder is due now.",
    priority: getNotificationPriority(reminder.priority),
    scheduledFor: dueTimestamp,
    action: {
      label: "Open reminders",
      href: "/reminders",
    },
    metadata: {
      reminderId: reminder.id,
      reminderDueDate: reminder.dueDate,
      reminderDueTime: reminder.dueTime,
    },
  });
}

export function processDueReminders(): number {
  const reminders = getStoredReminders();
  const now = Date.now();

  let created = 0;

  for (const reminder of reminders) {
    if (reminder.completed) {
      continue;
    }

    const dueTimestamp = getReminderTimestamp(reminder);

    if (dueTimestamp === null || dueTimestamp > now) {
      continue;
    }

    if (hasNotificationForReminder(reminder.id)) {
      continue;
    }

    createReminderNotification(reminder, dueTimestamp);
    created += 1;
  }

  return created;
}
