'use client';

import {
  ArrowRightLeft,
  Repeat2,
} from 'lucide-react';

import {
  CONVERTER_CATEGORIES,
} from '../lib/converter';

import { useConverter } from '../hooks/useConverter';

import { CategorySelector } from './CategorySelector';
import { ConversionResult } from './ConversionResult';
import { ConverterForm } from './ConverterForm';

export function ConverterPage() {
  const converter =
    useConverter();

  const category =
    CONVERTER_CATEGORIES.find(
      (item) =>
        item.id === converter.category,
    );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-zinc-500">
          <Repeat2 size={16} />

          <span className="text-sm">
            Nexa Utility
          </span>

          <ArrowRightLeft
            size={14}
          />

          <span className="text-sm">
            Converter
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Unit Converter
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Quickly convert common measurements,
          temperatures, speeds, data sizes,
          energy and more.
        </p>
      </div>

      <section className="space-y-6">
        <CategorySelector
          value={converter.category}
          onChange={
            converter.changeCategory
          }
        />

        <ConverterForm
          value={converter.value}
          fromUnit={
            converter.fromUnit
          }
          toUnit={
            converter.toUnit
          }
          units={converter.units}
          result={
            converter.formattedResult
          }
          onValueChange={
            converter.setValue
          }
          onFromChange={
            converter.setFromUnit
          }
          onToChange={
            converter.setToUnit
          }
          onSwap={
            converter.swapUnits
          }
        />

        <ConversionResult
          result={
            converter.formattedResult
          }
          fromUnit={
            category?.name ??
            converter.fromUnit
          }
          toUnit={
            converter.toUnit
          }
        />
      </section>
    </main>
  );
}
