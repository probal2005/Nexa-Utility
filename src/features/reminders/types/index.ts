export type ReminderPriority =
  | "low"
  | "medium"
  | "high";

export type ReminderSource =
  | "manual"
  | "calendar"
  | "ocr"
  | "task";

export type Reminder = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority: ReminderPriority;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  source?: ReminderSource;
  sourceId?: string;
};
