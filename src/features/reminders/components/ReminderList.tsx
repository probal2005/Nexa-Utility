"use client";

import {
  Bell,
  CalendarDays,
  Check,
  Clock3,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  formatReminderDate,
  isReminderOverdue,
  priorityLabel,
} from "@/features/reminders/lib/reminders";

import type { Reminder } from "@/features/reminders/types";

import {
  createCalendarEventFromReminder,
} from "@/features/integrations/reminders-calendar/reminderCalendar";

type Props = {
  reminders: Reminder[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export function ReminderList({
  reminders,
  onToggle,
  onDelete,
}: Props) {
  const [
    calendarStatus,
    setCalendarStatus,
  ] = useState<
    Record<
      string,
      "created" | "exists" | "missing-date"
    >
  >({});

  const handleAddToCalendar = (
    reminder: Reminder,
  ) => {
    const result =
      createCalendarEventFromReminder(
        reminder,
      );

    if (result.created) {
      setCalendarStatus((current) => ({
        ...current,
        [reminder.id]: "created",
      }));

      return;
    }

    if (
      result.reason ===
      "already-exists"
    ) {
      setCalendarStatus((current) => ({
        ...current,
        [reminder.id]: "exists",
      }));

      return;
    }

    setCalendarStatus((current) => ({
      ...current,
      [reminder.id]: "missing-date",
    }));
  };

  if (reminders.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 text-center">
        <Bell className="mb-4 h-7 w-7 text-white/15" />

        <p className="text-sm text-white/35">
          No reminders here.
        </p>

        <p className="mt-1 max-w-sm text-xs leading-5 text-white/20">
          Add a reminder above and it will appear in this list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {reminders.map((reminder) => {
        const overdue =
          isReminderOverdue(reminder);

        const status =
          calendarStatus[reminder.id];

        return (
          <div
            key={reminder.id}
            className={[
              "group rounded-2xl border p-4 transition",
              reminder.completed
                ? "border-white/[0.05] bg-white/[0.02] opacity-55"
                : overdue
                  ? "border-white/10 bg-white/[0.045]"
                  : "border-white/[0.07] bg-white/[0.025] hover:bg-white/[0.045]",
            ].join(" ")}
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  onToggle(reminder.id)
                }
                aria-label={
                  reminder.completed
                    ? "Mark reminder active"
                    : "Complete reminder"
                }
                className={[
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                  reminder.completed
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-transparent hover:border-white/30",
                ].join(" ")}
              >
                <Check className="h-3.5 w-3.5" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3
                      className={[
                        "truncate text-sm font-medium",
                        reminder.completed
                          ? "text-white/40 line-through"
                          : "text-white",
                      ].join(" ")}
                    >
                      {reminder.title}
                    </h3>

                    {reminder.description && (
                      <p className="mt-1 text-xs leading-5 text-white/30">
                        {reminder.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(reminder.id)
                    }
                    aria-label={`Delete ${reminder.title}`}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/15 transition hover:bg-white/[0.07] hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {reminder.dueDate && (
                    <span
                      className={[
                        "flex items-center gap-1 rounded-lg px-2 py-1 text-[10px]",
                        overdue &&
                        !reminder.completed
                          ? "bg-white/10 text-white/60"
                          : "bg-white/[0.04] text-white/30",
                      ].join(" ")}
                    >
                      <CalendarDays className="h-3 w-3" />

                      {formatReminderDate(
                        reminder.dueDate,
                        reminder.dueTime,
                      )}
                    </span>
                  )}

                  {reminder.dueTime && (
                    <span className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-white/30">
                      <Clock3 className="h-3 w-3" />

                      {reminder.dueTime}
                    </span>
                  )}

                  <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[10px] text-white/30">
                    {priorityLabel(
                      reminder.priority,
                    )}
                  </span>

                  {overdue &&
                    !reminder.completed && (
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-[10px] font-medium text-white/60">
                        Overdue
                      </span>
                    )}
                </div>

                {reminder.dueDate && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCalendar(
                          reminder,
                        )
                      }
                      className={[
                        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition",
                        status === "created"
                          ? "border-white/15 bg-white/10 text-white/70"
                          : status === "exists"
                            ? "border-white/10 bg-white/[0.05] text-white/45"
                            : "border-white/[0.08] bg-white/[0.025] text-white/40 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/70",
                      ].join(" ")}
                    >
                      <CalendarDays className="h-3 w-3" />

                      {status === "created"
                        ? "Added to Calendar"
                        : status === "exists"
                          ? "Already in Calendar"
                          : "Add to Calendar"}
                    </button>

                    {status ===
                      "missing-date" && (
                      <span className="text-[10px] text-white/30">
                        A due date is required.
                      </span>
                    )}
                  </div>
                )}

                {status === "created" && (
                  <p className="mt-2 text-[10px] text-white/30">
                    Calendar event created successfully.
                  </p>
                )}

                {status === "exists" && (
                  <p className="mt-2 text-[10px] text-white/30">
                    This reminder is already linked to a calendar event.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
