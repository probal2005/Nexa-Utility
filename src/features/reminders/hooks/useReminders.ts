"use client";

import { on } from "@/lib/events";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getStoredReminders,
  saveReminders,
} from "@/features/reminders/lib/reminders";

import type {
  Reminder,
  ReminderPriority,
} from "@/features/reminders/types";

export type ReminderFilter =
  | "all"
  | "active"
  | "completed";

function sortReminders(
  a: Reminder,
  b: Reminder,
) {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  if (a.dueDate && b.dueDate) {
    const dateCompare =
      a.dueDate.localeCompare(b.dueDate);

    if (dateCompare !== 0) {
      return dateCompare;
    }
  } else if (a.dueDate) {
    return -1;
  } else if (b.dueDate) {
    return 1;
  }

  if (a.dueTime && b.dueTime) {
    const timeCompare =
      a.dueTime.localeCompare(b.dueTime);

    if (timeCompare !== 0) {
      return timeCompare;
    }
  }

  const priorityOrder: Record<
    ReminderPriority,
    number
  > = {
    high: 0,
    medium: 1,
    low: 2,
  };

  return (
    priorityOrder[a.priority] -
    priorityOrder[b.priority]
  );
}

export function useReminders() {
  const [reminders, setReminders] =
    useState<Reminder[]>([]);

  const [filter, setFilter] =
    useState<ReminderFilter>("all");

  const [search, setSearch] =
    useState("");

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    setReminders(getStoredReminders());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    saveReminders(reminders);
  }, [reminders, hydrated]);

  useEffect(() => {
    const unsubscribe = on(
      "reminders:changed",
      () => {
        setReminders(getStoredReminders());
      },
    );

    return unsubscribe;
  }, []);

  const visibleReminders =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return reminders
        .filter((reminder) => {
          if (
            filter === "active" &&
            reminder.completed
          ) {
            return false;
          }

          if (
            filter === "completed" &&
            !reminder.completed
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return (
            reminder.title
              .toLowerCase()
              .includes(query) ||
            reminder.description
              ?.toLowerCase()
              .includes(query)
          );
        })
        .sort(sortReminders);
    }, [
      reminders,
      filter,
      search,
    ]);

  const addReminder = (
    data: Omit<
      Reminder,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "completed"
    >,
  ) => {
    const now = Date.now();

    const reminder: Reminder = {
      ...data,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    setReminders((current) => [
      reminder,
      ...current,
    ]);
  };

  const toggleReminder = (
    id: string,
  ) => {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              completed:
                !reminder.completed,
              updatedAt: Date.now(),
            }
          : reminder,
      ),
    );
  };

  const deleteReminder = (
    id: string,
  ) => {
    setReminders((current) =>
      current.filter(
        (reminder) =>
          reminder.id !== id,
      ),
    );
  };

  const clearCompleted = () => {
    setReminders((current) =>
      current.filter(
        (reminder) =>
          !reminder.completed,
      ),
    );
  };

  const counts = useMemo(
    () => ({
      all: reminders.length,
      active: reminders.filter(
        (reminder) =>
          !reminder.completed,
      ).length,
      completed:
        reminders.filter(
          (reminder) =>
            reminder.completed,
        ).length,
    }),
    [reminders],
  );

  return {
    reminders,
    visibleReminders,
    filter,
    search,
    counts,
    setFilter,
    setSearch,
    addReminder,
    toggleReminder,
    deleteReminder,
    clearCompleted,
  };
}
