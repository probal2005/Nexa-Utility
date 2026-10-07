import { emit } from "@/lib/events";
import { localStorageAdapter, STORAGE_KEYS } from "@/lib/storage";

import type {
  Task,
  TaskFilter,
} from "../types";

export const TASKS_STORAGE_KEY =
  STORAGE_KEYS.tasks;

export function getStoredTasks(): Task[] {
  const stored =
    localStorageAdapter.get<unknown>(
      TASKS_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as Task[])
    : [];
}

export function saveTasks(
  tasks: Task[],
): void {
  localStorageAdapter.set(
    TASKS_STORAGE_KEY,
    tasks,
  );

  emit("tasks:changed");
}

export function createTask(
  title: string,
  description = "",
  priority: Task["priority"] = "medium",
  dueDate: string | null = null,
): Task {
  const now = Date.now();

  return {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: description.trim(),
    priority,
    status: "todo",
    dueDate,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

export function updateTask(
  task: Task,
  updates: Partial<Task>,
): Task {
  return {
    ...task,
    ...updates,
    updatedAt: Date.now(),
  };
}

export function toggleTask(
  task: Task,
): Task {
  const completed =
    task.status !== "completed";

  return {
    ...task,
    status: completed
      ? "completed"
      : "todo",
    completedAt: completed
      ? Date.now()
      : null,
    updatedAt: Date.now(),
  };
}

export function filterTasks(
  tasks: Task[],
  filter: TaskFilter,
  query = "",
): Task[] {
  const normalizedQuery =
    query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" &&
        task.status === "todo") ||
      (filter === "completed" &&
        task.status === "completed") ||
      (filter === "high" &&
        task.priority === "high" &&
        task.status === "todo");

    if (!matchesFilter) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      task.title
        .toLowerCase()
        .includes(normalizedQuery) ||
      task.description
        .toLowerCase()
        .includes(normalizedQuery)
    );
  });
}

export function sortTasks(
  tasks: Task[],
): Task[] {
  return [...tasks].sort(
    (a, b) => {
      if (
        a.status !== b.status
      ) {
        return a.status ===
          "todo"
          ? -1
          : 1;
      }

      const priorityOrder = {
        high: 0,
        medium: 1,
        low: 2,
      };

      if (
        priorityOrder[a.priority] !==
        priorityOrder[b.priority]
      ) {
        return (
          priorityOrder[a.priority] -
          priorityOrder[b.priority]
        );
      }

      if (
        a.dueDate &&
        b.dueDate
      ) {
        return (
          new Date(a.dueDate).getTime() -
          new Date(b.dueDate).getTime()
        );
      }

      if (a.dueDate) {
        return -1;
      }

      if (b.dueDate) {
        return 1;
      }

      return (
        b.createdAt -
        a.createdAt
      );
    },
  );
}

export function isTaskOverdue(
  task: Task,
): boolean {
  if (
    !task.dueDate ||
    task.status === "completed"
  ) {
    return false;
  }

  return (
    new Date(task.dueDate).getTime() <
    Date.now()
  );
}
