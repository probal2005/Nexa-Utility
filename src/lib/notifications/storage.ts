import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

import type { NexaNotification } from "./types";

const NOTIFICATIONS_STORAGE_KEY =
  "nexa-utility-notifications";

export function loadNotifications(): NexaNotification[] {
  const stored =
    localStorageAdapter.get<unknown>(
      NOTIFICATIONS_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as NexaNotification[])
    : [];
}

function persistNotifications(
  notifications: NexaNotification[],
): void {
  localStorageAdapter.set(
    NOTIFICATIONS_STORAGE_KEY,
    notifications,
  );

  emit("notifications:changed");
}

export function getNotifications(): NexaNotification[] {
  return loadNotifications();
}

export function saveNotifications(
  notifications: NexaNotification[],
): void {
  persistNotifications(notifications);
}

export function addNotification(
  notification: NexaNotification,
): void {
  const notifications = loadNotifications();

  persistNotifications([
    notification,
    ...notifications,
  ]);
}

export function removeNotification(
  id: string,
): void {
  const notifications = loadNotifications();

  persistNotifications(
    notifications.filter(
      (notification) =>
        notification.id !== id,
    ),
  );
}

export function markNotificationRead(
  id: string,
): void {
  const notifications = loadNotifications();

  persistNotifications(
    notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            read: true,
          }
        : notification,
    ),
  );
}

export function markAllNotificationsRead(): void {
  const notifications = loadNotifications();

  persistNotifications(
    notifications.map((notification) => ({
      ...notification,
      read: true,
    })),
  );
}

export function clearNotifications(): void {
  persistNotifications([]);
}
