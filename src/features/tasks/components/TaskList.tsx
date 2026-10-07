"use client";

import {
  CalendarDays,
  Check,
  Circle,
  Clock3,
  BellPlus,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useState } from "react";

import {
  createCalendarEventFromTask,
  getCalendarEventForTask,
} from "@/features/integrations/tasks-calendar/taskCalendar";

import {
  createReminderFromTask,
  getReminderForTask,
} from "@/features/integrations/tasks-reminders/taskReminder";

import {
  isTaskOverdue,
} from "../lib/tasks";

import type {
  Task,
} from "../types";

type TaskListProps = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

type IntegrationStatus =
  | "idle"
  | "created"
  | "exists"
  | "missing-date";

export function TaskList({
  tasks,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-sm text-zinc-500">
          No tasks here yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  const overdue = isTaskOverdue(task);

  const existingReminder =
    getReminderForTask(task.id);

  const existingCalendarEvent =
    getCalendarEventForTask(task.id);

  const [
    reminderStatus,
    setReminderStatus,
  ] = useState<IntegrationStatus>(
    existingReminder
      ? "exists"
      : "idle",
  );

  const [
    calendarStatus,
    setCalendarStatus,
  ] = useState<IntegrationStatus>(
    existingCalendarEvent
      ? "exists"
      : "idle",
  );

  const addToReminder = () => {
    const response =
      createReminderFromTask(task);

    if (response.created) {
      setReminderStatus("created");
      return;
    }

    setReminderStatus(
      response.reason ===
        "already-exists"
        ? "exists"
        : "missing-date",
    );
  };

  const addToCalendar = () => {
    const response =
      createCalendarEventFromTask(
        task,
      );

    if (response.created) {
      setCalendarStatus("created");
      return;
    }

    setCalendarStatus(
      response.reason ===
        "already-exists"
        ? "exists"
        : "missing-date",
    );
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() =>
            onToggle(task.id)
          }
          className="mt-0.5 shrink-0 text-zinc-500 transition hover:text-white"
          aria-label={
            task.status === "completed"
              ? "Mark task active"
              : "Complete task"
          }
        >
          {task.status ===
          "completed" ? (
            <Check
              size={22}
              className="text-emerald-400"
            />
          ) : (
            <Circle size={22} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-medium ${
              task.status === "completed"
                ? "text-zinc-500 line-through"
                : "text-white"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 text-sm leading-5 text-zinc-500">
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-zinc-400">
              {priorityLabels[
                task.priority
              ]}
            </span>

            {task.dueDate && (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 ${
                  overdue
                    ? "border-red-400/20 text-red-300"
                    : "border-white/10 text-zinc-500"
                }`}
              >
                <Clock3 size={12} />

                {new Date(
                  `${task.dueDate}T00:00:00`,
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={addToReminder}
              disabled={
                !task.dueDate ||
                reminderStatus ===
                  "created"
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {reminderStatus ===
              "created" ? (
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />
              ) : (
                <BellPlus size={14} />
              )}

              {reminderStatus ===
              "created"
                ? "Added to Reminder"
                : reminderStatus ===
                    "exists"
                  ? "Already in Reminder"
                  : reminderStatus ===
                      "missing-date"
                    ? "Due date required"
                    : "Add to Reminder"}
            </button>

            <button
              type="button"
              onClick={addToCalendar}
              disabled={
                !task.dueDate ||
                calendarStatus ===
                  "created"
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {calendarStatus ===
              "created" ? (
                <CheckCircle2
                  size={14}
                  className="text-emerald-400"
                />
              ) : (
                <CalendarDays
                  size={14}
                />
              )}

              {calendarStatus ===
              "created"
                ? "Added to Calendar"
                : calendarStatus ===
                    "exists"
                  ? "Already in Calendar"
                  : calendarStatus ===
                      "missing-date"
                    ? "Due date required"
                    : "Add to Calendar"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            onDelete(task.id)
          }
          className="self-start rounded-xl p-2 text-zinc-600 transition hover:bg-red-400/10 hover:text-red-300"
          aria-label="Delete task"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
