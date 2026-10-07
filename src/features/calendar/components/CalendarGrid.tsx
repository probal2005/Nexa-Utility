"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  formatDateKey,
  formatMonthTitle,
  getMonthDays,
  isSameDay,
  WEEKDAYS,
} from "@/features/calendar/lib/calendar";
import type { CalendarEvent } from "@/features/calendar/types";

type Props = {
  currentMonth: Date;
  selectedDate: Date;
  today: Date;
  events: CalendarEvent[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectDate: (date: Date) => void;
};

export function CalendarGrid({
  currentMonth,
  selectedDate,
  today,
  events,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onSelectDate,
}: Props) {
  const days = getMonthDays(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/30">
            Calendar
          </p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            {formatMonthTitle(currentMonth)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToday}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/[0.08] hover:text-white"
          >
            Today
          </button>

          <button
            type="button"
            onClick={onPreviousMonth}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onNextMonth}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-white/[0.06]">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-1 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-white/25 sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {days.map((date) => {
          const dateKey = formatDateKey(date);

          const isCurrentMonth =
            date.getMonth() === currentMonth.getMonth() &&
            date.getFullYear() === currentMonth.getFullYear();

          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          const dayEvents = events.filter(
            (event) => event.date === dateKey,
          );

          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(date)}
              className={[
                "group relative min-h-20 border-b border-r border-white/[0.05] p-1.5 text-left transition sm:min-h-24 sm:p-2",
                "hover:bg-white/[0.045]",
                !isCurrentMonth ? "opacity-25" : "",
                isSelected ? "bg-white/[0.07]" : "",
              ].join(" ")}
            >
              <div className="flex justify-end">
                <span
                  className={[
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium",
                    isToday
                      ? "bg-white text-black"
                      : isSelected
                        ? "bg-white/15 text-white"
                        : "text-white/60",
                  ].join(" ")}
                >
                  {date.getDate()}
                </span>
              </div>

              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded-md bg-white/[0.08] px-1.5 py-1 text-[9px] text-white/60"
                  >
                    {event.title}
                  </div>
                ))}

                {dayEvents.length > 2 && (
                  <p className="px-1 text-[9px] text-white/25">
                    +{dayEvents.length - 2} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
