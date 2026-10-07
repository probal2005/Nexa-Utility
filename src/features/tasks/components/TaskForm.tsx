'use client';

import {
  Plus,
} from 'lucide-react';

import {
  useState,
} from 'react';

import type {
  TaskPriority,
} from '../types';

type TaskFormProps = {
  onAdd: (
    title: string,
    description: string,
    priority: TaskPriority,
    dueDate: string | null,
  ) => void;
};

export function TaskForm({
  onAdd,
}: TaskFormProps) {
  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    priority,
    setPriority,
  ] =
    useState<TaskPriority>(
      'medium',
    );

  const [
    dueDate,
    setDueDate,
  ] = useState('');

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    onAdd(
      title,
      description,
      priority,
      dueDate || null,
    );

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
    >
      <input
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        placeholder="What needs to be done?"
        className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
      />

      <textarea
        value={description}
        onChange={(event) =>
          setDescription(
            event.target.value,
          )
        }
        placeholder="Description (optional)"
        rows={3}
        className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <select
          value={priority}
          onChange={(event) =>
            setPriority(
              event.target
                .value as TaskPriority,
            )
          }
          className="h-11 rounded-2xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
        >
          <option value="low">
            Low priority
          </option>
          <option value="medium">
            Medium priority
          </option>
          <option value="high">
            High priority
          </option>
        </select>

        <input
          type="datetime-local"
          value={dueDate}
          onChange={(event) =>
            setDueDate(
              event.target.value,
            )
          }
          className="h-11 rounded-2xl border border-white/10 bg-zinc-950 px-3 text-sm text-white outline-none"
        />

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          <Plus size={17} />
          Add task
        </button>
      </div>
    </form>
  );
}
