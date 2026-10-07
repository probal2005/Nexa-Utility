'use client';

import {
  ArrowLeftRight,
} from 'lucide-react';

import type {
  UnitDefinition,
} from '../types';

type ConverterFormProps = {
  value: string;
  fromUnit: string;
  toUnit: string;
  units: UnitDefinition[];
  result: string;
  onValueChange: (
    value: string,
  ) => void;
  onFromChange: (
    value: string,
  ) => void;
  onToChange: (
    value: string,
  ) => void;
  onSwap: () => void;
};

export function ConverterForm({
  value,
  fromUnit,
  toUnit,
  units,
  result,
  onValueChange,
  onFromChange,
  onToChange,
  onSwap,
}: ConverterFormProps) {
  const getUnit = (id: string) =>
    units.find(
      (unit) => unit.id === id,
    );

  const from = getUnit(fromUnit);
  const to = getUnit(toUnit);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-end">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            From
          </label>

          <input
            type="number"
            value={value}
            onChange={(event) =>
              onValueChange(
                event.target.value,
              )
            }
            className="mb-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-2xl font-semibold text-white outline-none transition focus:border-white/30"
            placeholder="Enter value"
          />

          <select
            value={fromUnit}
            onChange={(event) =>
              onFromChange(
                event.target.value,
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
          >
            {units.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onSwap}
          aria-label="Swap units"
          className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 transition hover:bg-white/10"
        >
          <ArrowLeftRight
            size={18}
          />
        </button>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            To
          </label>

          <div className="mb-3 flex min-h-[68px] items-center rounded-2xl border border-white/10 bg-black/20 px-4">
            <span className="break-all text-2xl font-semibold text-white">
              {result}
            </span>
          </div>

          <select
            value={toUnit}
            onChange={(event) =>
              onToChange(
                event.target.value,
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none"
          >
            {units.map((unit) => (
              <option
                key={unit.id}
                value={unit.id}
              >
                {unit.name} ({unit.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <p className="text-sm text-zinc-400">
          {value || '0'}{' '}
          {from?.symbol ?? ''}{' '}
          <span className="text-zinc-600">
            =
          </span>{' '}
          <span className="font-semibold text-white">
            {result}
          </span>{' '}
          {to?.symbol ?? ''}
        </p>
      </div>
    </div>
  );
}
