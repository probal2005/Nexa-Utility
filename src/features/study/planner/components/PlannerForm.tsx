"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardPlus,
  X,
} from "lucide-react";
import type {
  PlannerItem,
  PlannerItemType,
  PlannerPriority,
  PlannerStatus,
} from "@/features/study/planner/types";
import { PLANNER_TYPE_LABELS } from "@/features/study/planner/lib/planner";

type PlannerFormProps = {
  item?: PlannerItem | null;
  subjects: string[];
  onSave: (
    data: Omit<
      PlannerItem,
      "id" | "createdAt" | "completedAt"
    >,
  ) => void;
  onUpdate: (
    id: string,
    updates: Partial<PlannerItem>,
  ) => void;
  onClose: () => void;
};

type PlannerFormState = {
  title: string;
  description: string;
  subject: string;
  type: PlannerItemType;
  priority: PlannerPriority;
  status: PlannerStatus;
  dueDate: string;
  dueTime: string;
  examId: string | null;
};

const emptyForm: PlannerFormState = {
  title: "",
  description: "",
  subject: "",
  type: "assignment",
  priority: "medium",
  status: "pending",
  dueDate: "",
  dueTime: "",
  examId: null,
};

export function PlannerForm({
  item,
  subjects,
  onSave,
  onUpdate,
  onClose,
}: PlannerFormProps) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!item) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: item.title,
      description: item.description,
      subject: item.subject,
      type: item.type,
      priority: item.priority,
      status: item.status,
      dueDate: item.dueDate,
      dueTime: item.dueTime,
      examId: item.examId,
    });
  }, [item]);

  const isEditing = Boolean(item);

  function update<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const data = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      subject: form.subject.trim(),
    };

    if (item) {
      onUpdate(item.id, data);
    } else {
      onSave(data);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardPlus className="h-5 w-5" />
              <h2 className="text-lg font-semibold">
                {isEditing
                  ? "Edit Planner Item"
                  : "Add Planner Item"}
              </h2>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Organize your academic work and deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Title
            </label>

            <input
              value={form.title}
              onChange={(event) =>
                update("title", event.target.value)
              }
              placeholder="e.g. Complete ML assignment"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-white/30"
              required
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Subject
              </label>

              <input
                list="planner-subjects"
                value={form.subject}
                onChange={(event) =>
                  update("subject", event.target.value)
                }
                placeholder="e.g. Machine Learning"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-white/30"
              />

              <datalist id="planner-subjects">
                {subjects.map((subject) => (
                  <option key={subject} value={subject} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Type
              </label>

              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    "type",
                    event.target.value as PlannerItemType,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-white/30"
              >
                {(
                  Object.entries(
                    PLANNER_TYPE_LABELS,
                  ) as [PlannerItemType, string][]
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                update("description", event.target.value)
              }
              placeholder="Optional details..."
              rows={4}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-zinc-600 focus:border-white/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  update(
                    "priority",
                    event.target.value as PlannerPriority,
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-white/30"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Due Date
              </label>

              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  update("dueDate", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Due Time
              </label>

              <input
                type="time"
                value={form.dueTime}
                onChange={(event) =>
                  update("dueTime", event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <select
              value={form.status}
              onChange={(event) =>
                update(
                  "status",
                  event.target.value as PlannerStatus,
                )
              }
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-white/30"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-500">
            <CalendarDays className="h-4 w-4 shrink-0" />
            Planner data is stored locally on this device.
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              {isEditing ? "Save Changes" : "Add Planner Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
