import { getNotifications, notify } from "@/lib/notifications";
import { getStoredTasks } from "@/features/tasks/lib/tasks";
import type { Task } from "@/features/tasks/types";

const TASK_NOTIFICATION_TYPE = "task";

function getTaskDueTimestamp(
  task: Task,
): number | null {
  if (!task.dueDate) {
    return null;
  }

  const timestamp = new Date(
    `${task.dueDate}T00:00:00`,
  ).getTime();

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return timestamp;
}

function hasNotificationForTask(
  taskId: string,
): boolean {
  return getNotifications().some(
    (notification) =>
      notification.type === TASK_NOTIFICATION_TYPE &&
      notification.metadata?.taskId === taskId,
  );
}

function getTaskNotificationPriority(
  priority: Task["priority"],
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

function createTaskNotification(
  task: Task,
  dueTimestamp: number,
): void {
  if (hasNotificationForTask(task.id)) {
    return;
  }

  const isOverdue =
    dueTimestamp < Date.now();

  notify({
    type: "task",
    title: isOverdue
      ? `Task overdue: ${task.title}`
      : task.title,
    message: isOverdue
      ? "This task is overdue."
      : task.description || "Your task is due today.",
    priority:
      isOverdue
        ? "high"
        : getTaskNotificationPriority(
            task.priority,
          ),
    scheduledFor: dueTimestamp,
    action: {
      label: "Open tasks",
      href: "/tasks",
    },
    metadata: {
      taskId: task.id,
      taskDueDate: task.dueDate,
      taskPriority: task.priority,
    },
  });
}

export function processDueTasks(): number {
  const tasks = getStoredTasks();
  const now = Date.now();

  let created = 0;

  for (const task of tasks) {
    if (task.status === "completed") {
      continue;
    }

    const dueTimestamp =
      getTaskDueTimestamp(task);

    if (
      dueTimestamp === null ||
      dueTimestamp > now
    ) {
      continue;
    }

    if (hasNotificationForTask(task.id)) {
      continue;
    }

    createTaskNotification(
      task,
      dueTimestamp,
    );

    created += 1;
  }

  return created;
}
