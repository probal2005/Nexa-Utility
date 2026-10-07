'use client';

import {
  Search,
} from 'lucide-react';

import type {
  TaskFilter,
} from '../types';

type TaskFiltersProps = {
  filter: TaskFilter;
  query: string;
  onFilterChange: (
    filter: TaskFilter,
  ) => void;
  onQueryChange: (
    query: string,
  ) => void;
};

const filters: {
  value: TaskFilter;
  label: string;
}[] = [
  {
    value: 'all',
    label: 'All',
  },
  {
    value: 'active',
    label: 'Active',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
  {
    value: 'high',
    label: 'High priority',
  },
];

export function TaskFilters({
  filter,
  query,
  onFilterChange,
  onQueryChange,
}: TaskFiltersProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
        />

        <input
          value={query}
          onChange={(event) =>
            onQueryChange(
              event.target.value,
            )
          }
          placeholder="Search tasks..."
          className="h-11 w-full rounded-2xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-white/20"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              onFilterChange(
                item.value,
              )
            }
            className={`rounded-full px-3.5 py-2 text-xs font-medium transition ${
              filter === item.value
                ? 'bg-white text-black'
                : 'border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
