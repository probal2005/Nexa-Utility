"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Clock,
  Filter,
  Plus,
  Search,
  Target,
} from "lucide-react";
import type {
  PlannerFilter,
  PlannerItem,
} from "@/features/study/planner/types";
import { useAcademicPlanner } from "@/features/study/planner/hooks/useAcademicPlanner";
import { PlannerForm } from "@/features/study/planner/components/PlannerForm";
import { PlannerItemCard } from "@/features/study/planner/components/PlannerItemCard";

const filters: {
  value: PlannerFilter;
  label: string;
}[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "today", label: "Today" },
  { value: "overdue", label: "Overdue" },
  { value: "completed", label: "Completed" },
];

export function AcademicPlanner() {
  const {
    items,
    filteredItems,
    subjects,
    stats,
    search,
    setSearch,
    filter,
    setFilter,
    hydrated,
    addItem,
    updateItem,
    toggleComplete,
    deleteItem,
    clearCompleted,
  } = useAcademicPlanner();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] =
    useState<PlannerItem | null>(null);

  const completionPercentage = useMemo(() => {
    if (stats.total === 0) {
      return 0;
    }

    return Math.round(
      (stats.completed / stats.total) * 100,
    );
  }, [stats.completed, stats.total]);

  function openCreate() {
    setEditingItem(null);
    setShowForm(true);
  }

  function openEdit(item: PlannerItem) {
    setEditingItem(item);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingItem(null);
  }

  if (!hydrated) {
    return (
      <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 w-64 rounded-lg bg-white/10" />
            <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/5" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 rounded-2xl bg-white/5"
                />
              ))}
            </div>

            <div className="mt-6 h-64 rounded-2xl bg-white/5" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <ClipboardList className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Study Tools
                </p>

                <h1 className="text-2xl font-bold tracking-tight">
                  Academic Planner
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              Keep assignments, projects, deadlines, and
              study goals organized in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Add Planner Item
          </button>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Target className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Total
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <Clock className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Today
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold">
              {stats.today}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-5">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Overdue
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold">
              {stats.overdue}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-zinc-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">
                Completion
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold">
              {completionPercentage}%
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search planner..."
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-white/20"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="h-4 w-4 shrink-0 text-zinc-600" />

              {filters.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setFilter(option.value)
                  }
                  className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition ${
                    filter === option.value
                      ? "bg-white text-black"
                      : "bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">
                Planner Items
              </h2>

              <p className="mt-1 text-xs text-zinc-600">
                Showing {filteredItems.length} of{" "}
                {items.length} items
              </p>
            </div>

            {stats.completed > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="text-xs text-zinc-600 transition hover:text-zinc-300"
              >
                Clear completed
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-zinc-700" />

              <h3 className="mt-4 font-semibold">
                {items.length === 0
                  ? "Your planner is empty"
                  : "No matching planner items"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
                {items.length === 0
                  ? "Add your first assignment, project, deadline, or study goal."
                  : "Try another search term or change the active filter."}
              </p>

              {items.length === 0 && (
                <button
                  type="button"
                  onClick={openCreate}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
                >
                  <Plus className="h-4 w-4" />
                  Add First Item
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <PlannerItemCard
                  key={item.id}
                  item={item}
                  onToggle={() =>
                    toggleComplete(item.id)
                  }
                  onEdit={() => openEdit(item)}
                  onDelete={() =>
                    deleteItem(item.id)
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <PlannerForm
          item={editingItem}
          subjects={subjects}
          onSave={addItem}
          onUpdate={updateItem}
          onClose={closeForm}
        />
      )}
    </main>
  );
}
