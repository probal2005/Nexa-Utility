"use client";

import { Bell, Search } from "lucide-react";

import { ReminderForm } from "@/features/reminders/components/ReminderForm";
import { ReminderList } from "@/features/reminders/components/ReminderList";
import { useReminders } from "@/features/reminders/hooks/useReminders";

export function RemindersPage() {
  const {
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
  } = useReminders();

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
              Nexa Utility
            </p>

            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Reminders
            </h1>
          </div>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
          Keep track of things you need to do, important dates, and
          upcoming tasks without leaving your workspace.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <ReminderForm onAddReminder={addReminder} />

        <section className="min-w-0">
          <div className="mb-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search reminders..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ["all", `All ${counts.all}`],
                    ["active", `Active ${counts.active}`],
                    ["completed", `Completed ${counts.completed}`],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={[
                      "rounded-xl px-3 py-2 text-xs font-medium transition",
                      filter === value
                        ? "bg-white text-black"
                        : "bg-white/[0.04] text-white/35 hover:bg-white/[0.08] hover:text-white",
                    ].join(" ")}
                  >
                    {label}
                  </button>
                ))}

                {counts.completed > 0 && (
                  <button
                    type="button"
                    onClick={clearCompleted}
                    className="ml-auto rounded-xl px-3 py-2 text-xs text-white/25 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Clear completed
                  </button>
                )}
              </div>
            </div>
          </div>

          <ReminderList
            reminders={visibleReminders}
            onToggle={toggleReminder}
            onDelete={deleteReminder}
          />
        </section>
      </div>
    </div>
  );
}
