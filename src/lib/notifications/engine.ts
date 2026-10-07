import {
  addNotification,
  clearNotifications,
  loadNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
} from "./storage";
import {
  showBrowserNotification,
} from "./browser/notifications";
import type {
  NexaNotification,
  NotificationPriority,
  NotificationType,
} from "./types";

function createNotificationId(): string {
  return `notification-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message?: string;
  priority?: NotificationPriority;
  scheduledFor?: number;
  action?: NexaNotification["action"];
  metadata?: Record<string, unknown>;
}

export function notify(
  input: CreateNotificationInput,
): NexaNotification {
  const notification: NexaNotification = {
    id: createNotificationId(),
    type: input.type,
    title: input.title,
    message: input.message,
    priority: input.priority ?? "normal",
    createdAt: Date.now(),
    scheduledFor: input.scheduledFor,
    read: false,
    action: input.action,
    metadata: input.metadata,
  };

  // Always keep the notification in Nexa's local history.
  addNotification(notification);

  // Also attempt a native browser notification.
  // This safely does nothing when permission is not granted,
  // browser notifications are unsupported, or the user
  // has disabled Nexa notifications.
  if (typeof window !== "undefined") {
    showBrowserNotification(notification);
  }

  return notification;
}

export function getNotifications(): NexaNotification[] {
  return loadNotifications();
}

export function getUnreadNotifications(): NexaNotification[] {
  return loadNotifications().filter(
    (notification) => !notification.read,
  );
}

export function getUnreadNotificationCount(): number {
  return getUnreadNotifications().length;
}

export function readNotification(id: string): void {
  markNotificationRead(id);
}

export function readAllNotifications(): void {
  markAllNotificationsRead();
}

export function dismissNotification(id: string): void {
  removeNotification(id);
}

export function clearAllNotifications(): void {
  clearNotifications();
}
