'use client';

import {
  Camera,
  CircleStop,
} from 'lucide-react';

import type { DocumentFilter } from '../types';

type DocumentControlsProps = {
  filter: DocumentFilter;
  onFilterChange: (
    filter: DocumentFilter,
  ) => void;
  onCapture: () => void;
  onStop: () => void;
  active: boolean;
  capturing: boolean;
};

const filters: Array<{
  id: DocumentFilter;
  label: string;
}> = [
  {
    id: 'original',
    label: 'Original',
  },
  {
    id: 'grayscale',
    label: 'B&W',
  },
  {
    id: 'contrast',
    label: 'Contrast',
  },
];

export function DocumentControls({
  filter,
  onFilterChange,
  onCapture,
  onStop,
  active,
  capturing,
}: DocumentControlsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              onFilterChange(item.id)
            }
            className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
              filter === item.id
                ? 'bg-white text-black'
                : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4">
        {active && (
          <button
            type="button"
            onClick={onStop}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
            aria-label="Stop camera"
          >
            <CircleStop className="h-5 w-5" />
          </button>
        )}

        <button
          type="button"
          onClick={onCapture}
          disabled={!active || capturing}
          className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white text-black shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Capture document"
        >
          <Camera className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
