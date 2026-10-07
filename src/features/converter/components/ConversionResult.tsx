import {
  Calculator,
  Sparkles,
} from 'lucide-react';

type ConversionResultProps = {
  result: string;
  fromUnit: string;
  toUnit: string;
};

export function ConversionResult({
  result,
  fromUnit,
  toUnit,
}: ConversionResultProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
          <Calculator
            size={19}
          />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-300">
            Conversion result
          </p>

          <p className="text-xs text-zinc-500">
            {fromUnit} → {toUnit}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="break-all text-4xl font-bold tracking-tight text-white">
          {result}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
        <Sparkles size={14} />
        <span>
          Calculated locally in your browser.
        </span>
      </div>
    </div>
  );
}
