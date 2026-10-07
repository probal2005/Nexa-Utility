"use client";

import { emit, on } from "@/lib/events";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CalendarEvent } from "@/features/calendar/types";
import { formatDateKey } from "@/features/calendar/lib/calendar";
import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

const STORAGE_KEY = STORAGE_KEYS.calendarEvents;

function loadEvents(): CalendarEvent[] {
  const stored = localStorageAdapter.get<unknown>(STORAGE_KEY);

  return Array.isArray(stored)
    ? (stored as CalendarEvent[])
    : [];
}

export function useCalendar() {
  const today = useMemo(
    () => new Date(),
    [],
  );

  const [currentMonth, setCurrentMonth] = useState(
    () =>
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
  );

  const [selectedDate, setSelectedDate] = useState(today);

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEvents(loadEvents());
    setHydrated(true);
  }, []);

  useEffect(() => {
    const unsubscribe = on(
      "calendar:changed",
      () => {
        setEvents(loadEvents());
      },
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorageAdapter.set(
      STORAGE_KEY,
      events,
    );
  }, [events, hydrated]);

  const selectedDateKey = formatDateKey(selectedDate);

  const selectedEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.date === selectedDateKey,
        )
        .sort((a, b) => {
          const aTime = a.time || "99:99";
          const bTime = b.time || "99:99";

          return aTime.localeCompare(bTime);
        }),
    [events, selectedDateKey],
  );

  const goToPreviousMonth = () => {
    setCurrentMonth(
      (month) =>
        new Date(
          month.getFullYear(),
          month.getMonth() - 1,
          1,
        ),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      (month) =>
        new Date(
          month.getFullYear(),
          month.getMonth() + 1,
          1,
        ),
    );
  };

  const goToToday = () => {
    const now = new Date();

    setCurrentMonth(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      ),
    );

    setSelectedDate(now);
  };

  const selectDate = (date: Date) => {
    setSelectedDate(date);

    if (
      date.getMonth() !== currentMonth.getMonth() ||
      date.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          1,
        ),
      );
    }
  };

  const addEvent = (
    event: Omit<
      CalendarEvent,
      "id" | "createdAt"
    >,
  ) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };

    setEvents((current) => [
      ...current,
      newEvent,
    ]);

    emit("calendar:changed");
  };

  const deleteEvent = (id: string) => {
    setEvents((current) =>
      current.filter(
        (event) => event.id !== id,
      ),
    );

    emit("calendar:changed");
  };

  const getEventsForDate = (date: Date) => {
    const key = formatDateKey(date);

    return events.filter(
      (event) => event.date === key,
    );
  };

  return {
    currentMonth,
    selectedDate,
    selectedEvents,
    events,
    goToPreviousMonth,
    goToNextMonth,
    goToToday,
    selectDate,
    addEvent,
    deleteEvent,
    getEventsForDate,
  };
}
