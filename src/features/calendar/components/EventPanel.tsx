"use client";

import {
  BellPlus,
  CalendarPlus,
  Check,
  Clock3,
  FileText,
  Trash2,
} from "lucide-react";

import {
  FormEvent,
  useState,
} from "react";

import {
  formatSelectedDate,
} from "@/features/calendar/lib/calendar";

import type {
  CalendarEvent,
} from "@/features/calendar/types";

import {
  createReminderFromCalendarEvent,
} from "@/features/integrations/calendar-reminders/calendarReminder";

import {
  createNoteFromCalendarEvent,
} from "@/features/integrations/calendar-notes/calendarNote";

type Props = {
  selectedDate: Date;
  events: CalendarEvent[];
  onAddEvent: (
    event: Omit<
      CalendarEvent,
      "id" | "createdAt"
    >,
  ) => void;
  onDeleteEvent: (
    id: string,
  ) => void;
};

export function EventPanel({
  selectedDate,
  events,
  onAddEvent,
  onDeleteEvent,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [time, setTime] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [
    reminderStatus,
    setReminderStatus,
  ] = useState<
    Record<
      string,
      "created" | "exists"
    >
  >({});

  const [
    noteStatus,
    setNoteStatus,
  ] = useState<
    Record<
      string,
      "created" | "exists"
    >
  >({});

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanTitle =
      title.trim();

    if (!cleanTitle) {
      return;
    }

    const date = [
      selectedDate.getFullYear(),
      String(
        selectedDate.getMonth() + 1,
      ).padStart(2, "0"),
      String(
        selectedDate.getDate(),
      ).padStart(2, "0"),
    ].join("-");

    onAddEvent({
      date,
      title: cleanTitle,
      time:
        time || undefined,
      description:
        description.trim() ||
        undefined,
    });

    setTitle("");
    setTime("");
    setDescription("");
    setShowForm(false);
  };

  const handleCreateReminder = (
    event: CalendarEvent,
  ) => {
    const result =
      createReminderFromCalendarEvent(
        event,
      );

    setReminderStatus(
      (current) => ({
        ...current,
        [event.id]:
          result.created
            ? "created"
            : "exists",
      }),
    );
  };

  const handleCreateNote = (
    event: CalendarEvent,
  ) => {
    const result =
      createNoteFromCalendarEvent(
        event,
      );

    setNoteStatus(
      (current) => ({
        ...current,
        [event.id]:
          result.created
            ? "created"
            : "exists",
      }),
    );
  };

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/30">
          Selected day
        </p>

        <h3 className="mt-2 text-lg font-semibold text-white">
          {formatSelectedDate(
            selectedDate,
          )}
        </h3>
      </div>

      <button
        type="button"
        onClick={() =>
          setShowForm(
            (value) => !value,
          )
        }
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        <CalendarPlus className="h-4 w-4" />
        Add event
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4"
        >
          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            placeholder="Event title"
            autoFocus
            className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
          />

          <div className="relative">
            <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />

            <input
              type="time"
              value={time}
              onChange={(event) =>
                setTime(
                  event.target.value,
                )
              }
              className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none focus:border-white/20"
            />
          </div>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            placeholder="Description (optional)"
            rows={3}
            className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black"
            >
              Save event
            </button>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              className="rounded-xl border border-white/10 px-3 py-2.5 text-xs text-white/50 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">
            Events
          </h4>

          <span className="text-xs text-white/25">
            {events.length}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center">
            <CalendarPlus className="mx-auto mb-3 h-5 w-5 text-white/15" />

            <p className="text-sm text-white/35">
              Nothing scheduled.
            </p>

            <p className="mt-1 text-xs text-white/20">
              Add an event for this day.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const reminder =
                reminderStatus[
                  event.id
                ];

              const note =
                noteStatus[
                  event.id
                ];

              return (
                <div
                  key={event.id}
                  className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">
                        {event.title}
                      </p>

                      {event.time && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-white/35">
                          <Clock3 className="h-3 w-3" />
                          {event.time}
                        </p>
                      )}

                      {event.description && (
                        <p className="mt-2 text-xs leading-5 text-white/30">
                          {event.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onDeleteEvent(
                          event.id,
                        )
                      }
                      aria-label={`Delete ${event.title}`}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/20 transition hover:bg-white/[0.07] hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 grid gap-2 border-t border-white/[0.06] pt-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleCreateReminder(
                          event,
                        )
                      }
                      disabled={
                        reminder !==
                        undefined
                      }
                      className={[
                        "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition",
                        reminder ===
                        "created"
                          ? "bg-white/10 text-white/60"
                          : reminder ===
                              "exists"
                            ? "bg-white/[0.06] text-white/40"
                            : "bg-white/[0.06] text-white/55 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {reminder ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          {reminder ===
                          "created"
                            ? "Reminder created"
                            : "Reminder exists"}
                        </>
                      ) : (
                        <>
                          <BellPlus className="h-3.5 w-3.5" />
                          Remind me
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleCreateNote(
                          event,
                        )
                      }
                      disabled={
                        note !==
                        undefined
                      }
                      className={[
                        "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition",
                        note ===
                        "created"
                          ? "bg-white/10 text-white/60"
                          : note ===
                              "exists"
                            ? "bg-white/[0.06] text-white/40"
                            : "bg-white/[0.06] text-white/55 hover:bg-white/10 hover:text-white",
                      ].join(" ")}
                    >
                      {note ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          {note ===
                          "created"
                            ? "Note created"
                            : "Note exists"}
                        </>
                      ) : (
                        <>
                          <FileText className="h-3.5 w-3.5" />
                          Add note
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
