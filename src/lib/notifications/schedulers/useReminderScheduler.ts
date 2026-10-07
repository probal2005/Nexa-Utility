"use client";

import { on } from "@/lib/events";

import { useEffect } from "react";
import { processDueReminders } from "./reminders";

const CHECK_INTERVAL = 30_000;

export function useReminderScheduler(): void {
  useEffect(() => {
    processDueReminders();

    const interval = window.setInterval(() => {
      processDueReminders();
    }, CHECK_INTERVAL);

    const unsubscribe = on(
      "reminders:changed",
      () => {
        processDueReminders();
      },
    );

    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, []);
}
