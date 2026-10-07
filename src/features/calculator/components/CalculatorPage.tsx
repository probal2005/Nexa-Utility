"use client";

import { Calculator as CalculatorIcon } from "lucide-react";

import { Calculator } from "@/features/calculator/components/Calculator";

export function CalculatorPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
            <CalculatorIcon className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Calculator
            </h1>

            <p className="mt-1 text-sm text-white/50">
              Fast calculations with keyboard support and history.
            </p>
          </div>
        </div>
      </div>

      <Calculator />
    </div>
  );
}
