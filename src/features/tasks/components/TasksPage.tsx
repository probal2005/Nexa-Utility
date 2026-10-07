'use client';

import {
  CheckCircle2,
  ListTodo,
  Trash2,
} from 'lucide-react';

import {
  TaskFilters,
} from './TaskFilters';

import {
  TaskForm,
} from './TaskForm';

import {
  TaskList,
} from './TaskList';

import {
  useTasks,
} from '../hooks/useTasks';

export function TasksPage() {
  const {
    visibleTasks,
    stats,
    filter,
    setFilter,
    query,
    setQuery,
    addTask,
    completeTask,
    deleteTask,
    clearCompleted,
  } = useTasks();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <ListTodo
              size={23}
              className="text-white"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Tasks
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Organize what needs to get done,
              without leaving Nexa Utility.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          [
            'Total',
            stats.total,
          ],
          [
            'Active',
            stats.active,
          ],
          [
            'Completed',
            stats.completed,
          ],
          [
            'High priority',
            stats.high,
          ],
        ].map(
          ([label, value]) => (
            <div
              key={label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="text-xs uppercase tracking-wider text-zinc-600">
                {label}
              </div>

              <div className="mt-2 text-2xl font-bold text-white">
                {value}
              </div>
            </div>
          ),
        )}
      </section>

      <TaskForm
        onAdd={addTask}
      />

      <section className="space-y-4">
        <TaskFilters
          filter={filter}
          query={query}
          onFilterChange={
            setFilter
          }
          onQueryChange={
            setQuery
          }
        />

        <TaskList
          tasks={visibleTasks}
          onToggle={
            completeTask
          }
          onDelete={
            deleteTask
          }
        />

        {stats.completed > 0 && (
          <button
            type="button"
            onClick={
              clearCompleted
            }
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2.5 text-sm text-zinc-400 transition hover:border-red-400/20 hover:text-red-300"
          >
            <Trash2 size={16} />
            Clear completed
          </button>
        )}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <CheckCircle2
            size={17}
            className="text-emerald-400"
          />
          Local-first tasks
        </div>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Tasks are stored locally in your
          browser. Cloud synchronization can
          be added later without changing the
          task interface.
        </p>
      </section>
    </main>
  );
}
