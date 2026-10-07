"use client";

import {
  AlertCircle,
  CalendarClock,
  Check,
  Circle,
  Clock3,
  Edit3,
  Trash2,
} from "lucide-react";
import type { PlannerItem } from "@/features/study/planner/types";
import {
  PLANNER_PRIORITY_LABELS,
  PLANNER_STATUS_LABELS,
  PLANNER_TYPE_LABELS,
  formatPlannerDate,
  isPlannerOverdue,
  isPlannerToday,
} from "@/features/study/planner/lib/planner";

type PlannerItemCardProps = {
  item: PlannerItem;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function PlannerItemCard({
  item,
  onToggle,
  onEdit,
  onDelete,
}: PlannerItemCardProps) {
  const completed = item.status === "completed";
  const overdue = isPlannerOverdue(item);
  const today = isPlannerToday(item);

  return (
    <article
      className={`rounded-2xl border p-4 transition ${
        completed
          ? "border-white/5 bg-white/[0.02] opacity-70"
          : overdue
            ? "border-red-500/20 bg-red-500/[0.04]"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.05]"
      }`}
    >
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 shrink-0 text-zinc-500 transition hover:text-white"
          aria-label={
            completed
              ? "Mark as incomplete"
              : "Mark as completed"
          }
        >
          {completed ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-4 w-4" />
            </span>
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3
                className={`font-semibold ${
                  completed
                    ? "text-zinc-500 line-through"
                    : "text-white"
                }`}
              >
                {item.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">
                  {PLANNER_TYPE_LABELS[item.type]}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">
                  {PLANNER_PRIORITY_LABELS[item.priority]}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">
                  {PLANNER_STATUS_LABELS[item.status]}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                aria-label="Edit"
              >
                <Edit3 className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {item.subject && (
            <p className="mt-3 text-xs font-medium text-zinc-400">
              {item.subject}
            </p>
          )}

          {item.description && (
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {item.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            {item.dueDate && (
              <span
                className={`inline-flex items-center gap-1.5 ${
                  overdue
                    ? "text-red-400"
                    : today
                      ? "text-amber-400"
                      : "text-zinc-500"
                }`}
              >
                {overdue ? (
                  <AlertCircle className="h-3.5 w-3.5" />
                ) : (
                  <CalendarClock className="h-3.5 w-3.5" />
                )}

                {overdue
                  ? "Overdue · "
                  : today
                    ? "Today · "
                    : ""}
                {formatPlannerDate(
                  item.dueDate,
                  item.dueTime,
                )}
              </span>
            )}

            {!item.dueDate && (
              <span className="inline-flex items-center gap-1.5 text-zinc-600">
                <Clock3 className="h-3.5 w-3.5" />
                No deadline
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
