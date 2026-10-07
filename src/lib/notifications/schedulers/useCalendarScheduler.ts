"use client";

import { on } from "@/lib/events";

import { useEffect } from "react";

import { processDueCalendarEvents } from "./calendar";

const CHECK_INTERVAL = 30_000;

export function useCalendarScheduler(): void {
  useEffect(() => {
    processDueCalendarEvents();

    const interval = window.setInterval(() => {
      processDueCalendarEvents();
    }, CHECK_INTERVAL);

    const unsubscribe = on(
      "calendar:changed",
      () => {
        processDueCalendarEvents();
      },
    );

    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, []);
}
