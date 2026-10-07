"use client";

import { useCalendarScheduler } from "@/lib/notifications/schedulers/useCalendarScheduler";
import { useReminderScheduler } from "@/lib/notifications/schedulers/useReminderScheduler";
import { useTaskScheduler } from "@/lib/notifications/schedulers/useTaskScheduler";

export function NotificationScheduler() {
  useReminderScheduler();
  useCalendarScheduler();
  useTaskScheduler();

  return null;
}
