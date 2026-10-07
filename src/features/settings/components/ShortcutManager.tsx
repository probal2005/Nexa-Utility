"use client";

import {
  ArrowDown,
  ArrowUp,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AVAILABLE_TOOLS } from "@/config/tools";

type ShortcutManagerProps = {
  shortcuts: string[];
  onChange: (shortcuts: string[]) => void;
};

const DEFAULT_SHORTCUTS = [
  "clock",
  "calculator",
  "calendar",
  "notes",
];

export default function ShortcutManager({
  shortcuts,
  onChange,
}: ShortcutManagerProps) {
  const [selectedTool, setSelectedTool] = useState("");

  const selectedTools = useMemo(
    () =>
      shortcuts
        .map((id) =>
          AVAILABLE_TOOLS.find((tool) => tool.id === id),
        )
        .filter(Boolean),
    [shortcuts],
  );

  const availableToAdd = AVAILABLE_TOOLS.filter(
    (tool) => !shortcuts.includes(tool.id),
  );

  const addShortcut = () => {
    if (!selectedTool) {
      return;
    }

    onChange([...shortcuts, selectedTool]);
    setSelectedTool("");
  };

  const removeShortcut = (id: string) => {
    onChange(
      shortcuts.filter((shortcut) => shortcut !== id),
    );
  };

  const moveShortcut = (
    index: number,
    direction: "up" | "down",
  ) => {
    const next = [...shortcuts];

    const targetIndex =
      direction === "up" ? index - 1 : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >= next.length
    ) {
      return;
    }

    [next[index], next[targetIndex]] = [
      next[targetIndex],
      next[index],
    ];

    onChange(next);
  };

  const resetShortcuts = () => {
    onChange(DEFAULT_SHORTCUTS);
  };

  return (
    <section className="nexa-theme-surface rounded-2xl border p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="nexa-theme-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
          <Plus className="nexa-theme-accent h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Home App Dock
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Choose and order the tools shown first in the Home app dock.
          </p>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <select
          value={selectedTool}
          onChange={(event) =>
            setSelectedTool(event.target.value)
          }
          className="h-11 flex-1 rounded-xl border border-white/10 bg-black/20 px-3 text-sm outline-none focus:border-white/20"
        >
          <option value="">
            Select a tool to pin...
          </option>

          {availableToAdd.map((tool) => (
            <option key={tool.id} value={tool.id}>
              {tool.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addShortcut}
          disabled={!selectedTool}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          Pin app
        </button>
      </div>

      <div className="space-y-2">
        {selectedTools.map((tool, index) => {
          if (!tool) {
            return null;
          }

          const Icon = tool.icon;

          return (
            <div
              key={tool.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06]">
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {tool.name}
                </p>

                <p className="text-xs text-zinc-600">
                  {tool.category}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  moveShortcut(index, "up")
                }
                disabled={index === 0}
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/10 hover:text-white disabled:opacity-20"
                title="Move up"
              >
                <ArrowUp className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  moveShortcut(index, "down")
                }
                disabled={
                  index === selectedTools.length - 1
                }
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/10 hover:text-white disabled:opacity-20"
                title="Move down"
              >
                <ArrowDown className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  removeShortcut(tool.id)
                }
                className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
                title="Remove shortcut"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={resetShortcuts}
        className="mt-4 flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset shortcuts
      </button>
    </section>
  );
}
