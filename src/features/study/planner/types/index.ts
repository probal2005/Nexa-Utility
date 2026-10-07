export type PlannerItemType =
  | "assignment"
  | "project"
  | "deadline"
  | "study-goal";

export type PlannerPriority = "low" | "medium" | "high";

export type PlannerStatus = "pending" | "in-progress" | "completed";

export type PlannerItem = {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: PlannerItemType;
  priority: PlannerPriority;
  status: PlannerStatus;
  dueDate: string;
  dueTime: string;
  examId: string | null;
  createdAt: number;
  completedAt: number | null;
};

export type PlannerFilter =
  | "all"
  | "pending"
  | "in-progress"
  | "completed"
  | "overdue"
  | "today";

export type PlannerStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  today: number;
};
