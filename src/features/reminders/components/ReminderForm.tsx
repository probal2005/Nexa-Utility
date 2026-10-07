"use client";

import { BellPlus } from "lucide-react";
import { FormEvent, useState } from "react";

import type { ReminderPriority } from "@/features/reminders/types";

type Props = {
  onAddReminder: (data: {
    title: string;
    description?: string;
    dueDate?: string;
    dueTime?: string;
    priority: ReminderPriority;
  }) => void;
};

export function ReminderForm({ onAddReminder }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [priority, setPriority] =
    useState<ReminderPriority>("medium");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    onAddReminder({
      title: cleanTitle,
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setPriority("medium");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <BellPlus className="h-5 w-5 text-white" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-white/25">
            New reminder
          </p>

          <h2 className="font-semibold text-white">
            Add something to remember
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you need to remember?"
          className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
        />

        <textarea
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Description (optional)"
          rows={3}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/20"
          />

          <input
            type="time"
            value={dueTime}
            onChange={(event) => setDueTime(event.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/20"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {(["low", "medium", "high"] as const).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setPriority(option)}
                className={[
                  "rounded-xl border px-3 py-2.5 text-xs font-medium capitalize transition",
                  priority === option
                    ? "border-white/20 bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/35 hover:bg-white/[0.05] hover:text-white",
                ].join(" ")}
              >
                {option}
              </button>
            ),
          )}
        </div>

        <button
          type="submit"
          className="flex h-11 w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Add reminder
        </button>
      </div>
    </form>
  );
}
