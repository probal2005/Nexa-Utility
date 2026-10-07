import type { Reminder } from "@/features/reminders/types";
import type { Task } from "@/features/tasks/types";
import {
  REMINDERS_STORAGE_KEY,
} from "@/features/reminders/lib/reminders";
import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

type CreateTaskReminderResponse =
  | {
      created: true;
      reminder: Reminder;
    }
  | {
      created: false;
      reason: "already-exists" | "missing-date";
      reminder?: Reminder;
    };

function loadReminders(): Reminder[] {
  const stored =
    localStorageAdapter.get<unknown>(
      REMINDERS_STORAGE_KEY,
    );

  if (!Array.isArray(stored)) {
    return [];
  }

  return stored as Reminder[];
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

export function createReminderFromTask(
  task: Task,
): CreateTaskReminderResponse {
  if (!task.dueDate) {
    return {
      created: false,
      reason: "missing-date",
    };
  }

  const reminders = loadReminders();

  const existing = reminders.find(
    (reminder) =>
      reminder.source === "task" &&
      reminder.sourceId === task.id,
  );

  if (existing) {
    return {
      created: false,
      reason: "already-exists",
      reminder: existing,
    };
  }

  const now = Date.now();

  const reminder: Reminder = {
    id: crypto.randomUUID(),
    title: task.title,
    description:
      task.description ||
      `Task: ${task.title}`,
    dueDate: task.dueDate,
    priority: task.priority,
    completed:
      task.status === "completed",
    createdAt: now,
    updatedAt: now,
    source: "task",
    sourceId: task.id,
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

export function getReminderForTask(
  taskId: string,
): Reminder | null {
  const reminders = loadReminders();

  return (
    reminders.find(
      (reminder) =>
        reminder.source === "task" &&
        reminder.sourceId === taskId,
    ) ?? null
  );
}
