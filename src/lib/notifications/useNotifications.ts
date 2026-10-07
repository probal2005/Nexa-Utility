"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { on } from "@/lib/events";

import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
} from "./storage";

import type { NexaNotification } from "./types";

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<NexaNotification[]>([]);

  const [hydrated, setHydrated] =
    useState(false);

  const refresh = useCallback(() => {
    setNotifications(getNotifications());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
  }, [refresh]);

  useEffect(() => {
    return on(
      "notifications:changed",
      refresh,
    );
  }, [refresh]);

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          !notification.read,
      ).length,
    [notifications],
  );

  const markRead = useCallback(
    (id: string) => {
      markNotificationRead(id);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    markAllNotificationsRead();
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      removeNotification(id);
    },
    [],
  );

  const clearAll = useCallback(() => {
    clearNotifications();
  }, []);

  return {
    notifications,
    unreadCount,
    hydrated,
    markRead,
    markAllRead,
    dismiss,
    clearAll,

    // Compatibility aliases for existing consumers.
    remove: dismiss,
    clear: clearAll,

    refresh,
  };
}
