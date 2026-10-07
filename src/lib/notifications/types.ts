export type NotificationType =
  | "reminder"
  | "calendar"
  | "task"
  | "pomodoro"
  | "study"
  | "weather"
  | "system";

export type NotificationPriority =
  | "low"
  | "normal"
  | "high"
  | "urgent";

export interface NexaNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  priority: NotificationPriority;
  createdAt: number;
  scheduledFor?: number;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
  metadata?: Record<string, unknown>;
}
