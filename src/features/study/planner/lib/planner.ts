import type {
  PlannerItem,
  PlannerItemType,
  PlannerPriority,
  PlannerStatus,
} from "@/features/study/planner/types";

export const PLANNER_STORAGE_KEY = "nexa-utility-study-planner";

export const PLANNER_TYPE_LABELS: Record<PlannerItemType, string> = {
  assignment: "Assignment",
  project: "Project",
  deadline: "Deadline",
  "study-goal": "Study Goal",
};

export const PLANNER_PRIORITY_LABELS: Record<PlannerPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PLANNER_STATUS_LABELS: Record<PlannerStatus, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

export function createPlannerId(): string {
  return `planner-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function createEmptyPlannerItem(): PlannerItem {
  return {
    id: createPlannerId(),
    title: "",
    description: "",
    subject: "",
    type: "assignment",
    priority: "medium",
    status: "pending",
    dueDate: "",
    dueTime: "",
    examId: null,
    createdAt: Date.now(),
    completedAt: null,
  };
}

export function getPlannerDueTimestamp(item: PlannerItem): number {
  if (!item.dueDate) {
    return Number.POSITIVE_INFINITY;
  }

  const dateTime = item.dueTime
    ? `${item.dueDate}T${item.dueTime}`
    : `${item.dueDate}T23:59:59`;

  return new Date(dateTime).getTime();
}

export function isPlannerOverdue(item: PlannerItem): boolean {
  if (item.status === "completed" || !item.dueDate) {
    return false;
  }

  return getPlannerDueTimestamp(item) < Date.now();
}

export function isPlannerToday(item: PlannerItem): boolean {
  if (!item.dueDate) {
    return false;
  }

  const today = new Date();
  const dueDate = new Date(`${item.dueDate}T00:00:00`);

  return (
    today.getFullYear() === dueDate.getFullYear() &&
    today.getMonth() === dueDate.getMonth() &&
    today.getDate() === dueDate.getDate()
  );
}

export function formatPlannerDate(
  date: string,
  time?: string,
): string {
  if (!date) {
    return "No deadline";
  }

  const value = new Date(
    `${date}T${time || "23:59:59"}`,
  );

  if (Number.isNaN(value.getTime())) {
    return "Invalid date";
  }

  return value.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(time
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  });
}

export function sortPlannerItems(items: PlannerItem[]): PlannerItem[] {
  return [...items].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) {
      return b.createdAt - a.createdAt;
    }

    if (!a.dueDate) {
      return 1;
    }

    if (!b.dueDate) {
      return -1;
    }

    const dateDifference =
      getPlannerDueTimestamp(a) - getPlannerDueTimestamp(b);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return b.createdAt - a.createdAt;
  });
}
