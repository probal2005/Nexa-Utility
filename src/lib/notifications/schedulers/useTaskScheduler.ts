"use client";

import { on } from "@/lib/events";

import { useEffect } from "react";

import { processDueTasks } from "./tasks";

const CHECK_INTERVAL = 30_000;

export function useTaskScheduler(): void {
  useEffect(() => {
    processDueTasks();

    const interval = window.setInterval(() => {
      processDueTasks();
    }, CHECK_INTERVAL);

    const unsubscribe = on(
      "tasks:changed",
      () => {
        processDueTasks();
      },
    );

    return () => {
      window.clearInterval(interval);
      unsubscribe();
    };
  }, []);
}
