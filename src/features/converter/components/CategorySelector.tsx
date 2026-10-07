'use client';

import type {
  ConverterCategory,
} from '../types';

import {
  CONVERTER_CATEGORIES,
} from '../lib/converter';

type CategorySelectorProps = {
  value: ConverterCategory;
  onChange: (
    category: ConverterCategory,
  ) => void;
};

export function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {CONVERTER_CATEGORIES.map(
        (category) => {
          const active =
            category.id === value;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                onChange(category.id)
              }
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? 'border-white/30 bg-white/10'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
              }`}
            >
              <p className="text-sm font-semibold text-white">
                {category.name}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {category.description}
              </p>
            </button>
          );
        },
      )}
    </div>
  );
}
