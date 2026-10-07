"use client";

import {
  Calculator as CalculatorIcon,
  Delete,
  History,
} from "lucide-react";

import { useCalculator } from "@/features/calculator/hooks/useCalculator";

const buttons = [
  { label: "C", value: "clear", variant: "muted" },
  { label: "(", value: "(", variant: "muted" },
  { label: ")", value: ")", variant: "muted" },
  { label: "÷", value: "÷", variant: "operator" },

  { label: "7", value: "7", variant: "number" },
  { label: "8", value: "8", variant: "number" },
  { label: "9", value: "9", variant: "number" },
  { label: "×", value: "×", variant: "operator" },

  { label: "4", value: "4", variant: "number" },
  { label: "5", value: "5", variant: "number" },
  { label: "6", value: "6", variant: "number" },
  { label: "−", value: "−", variant: "operator" },

  { label: "1", value: "1", variant: "number" },
  { label: "2", value: "2", variant: "number" },
  { label: "3", value: "3", variant: "number" },
  { label: "+", value: "+", variant: "operator" },

  { label: "%", value: "%", variant: "muted" },
  { label: "0", value: "0", variant: "number" },
  { label: ".", value: ".", variant: "number" },
  { label: "=", value: "calculate", variant: "equals" },
] as const;

export function Calculator() {
  const {
    expression,
    result,
    history,
    append,
    clear,
    backspace,
    calculate,
    selectHistoryItem,
    clearHistory,
  } = useCalculator();

  const handleButton = (value: string) => {
    if (value === "clear") {
      clear();
      return;
    }

    if (value === "calculate") {
      calculate();
      return;
    }

    append(value);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <CalculatorIcon className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Utility
              </p>
              <h2 className="font-semibold text-white">
                Calculator
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={backspace}
            aria-label="Delete last character"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Delete className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl border border-white/10 bg-black/20 p-5 text-right">
          <div className="min-h-7 overflow-x-auto whitespace-nowrap text-sm text-white/40">
            {expression || "0"}
          </div>

          <div className="mt-2 min-h-12 overflow-x-auto whitespace-nowrap text-4xl font-semibold tracking-tight text-white">
            {result}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {buttons.map((button) => {
            const isOperator = button.variant === "operator";
            const isEquals = button.variant === "equals";
            const isMuted = button.variant === "muted";

            return (
              <button
                key={button.label}
                type="button"
                onClick={() => handleButton(button.value)}
                className={[
                  "flex h-14 items-center justify-center rounded-2xl text-lg font-medium transition active:scale-[0.97]",
                  isEquals
                    ? "bg-white text-black hover:bg-white/90"
                    : isOperator
                      ? "bg-white/10 text-white hover:bg-white/[0.16]"
                      : isMuted
                        ? "bg-white/[0.05] text-white/60 hover:bg-white/[0.1] hover:text-white"
                        : "bg-white/[0.03] text-white hover:bg-white/[0.08]",
                ].join(" ")}
              >
                {button.label}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/30">
          <span>Keyboard supported</span>
          <span>•</span>
          <span>Enter to calculate</span>
          <span>•</span>
          <span>Esc to clear</span>
        </div>
      </section>

      <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-white/50" />
            <h3 className="font-semibold text-white">History</h3>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="text-xs text-white/40 transition hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <Delete className="mb-3 h-5 w-5 text-white/20" />

            <p className="text-sm text-white/40">
              No calculations yet.
            </p>

            <p className="mt-1 text-xs text-white/25">
              Your recent calculations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectHistoryItem(item)}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.025] p-3 text-left transition hover:border-white/10 hover:bg-white/[0.06]"
              >
                <p className="truncate text-xs text-white/40">
                  {item.expression}
                </p>

                <p className="mt-1 truncate font-medium text-white">
                  = {item.result}
                </p>
              </button>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
