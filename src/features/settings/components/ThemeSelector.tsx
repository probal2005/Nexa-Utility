"use client";

import {
  Check,
  Palette,
} from "lucide-react";

import {
  THEMES,
  type NexaTheme,
} from "../types";

type ThemeSelectorProps = {
  value: NexaTheme;
  onChange: (
    theme: NexaTheme,
  ) => void;
};

export default function ThemeSelector({
  value,
  onChange,
}: ThemeSelectorProps) {
  return (
    <section className="nexa-theme-surface rounded-2xl p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="nexa-theme-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
          <Palette className="nexa-theme-accent h-5 w-5" />
        </div>

        <div>
          <h2 className="font-semibold">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-[color:var(--nexa-muted)]">
            Choose a premium Nexa glass theme.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => {
          const active =
            value === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() =>
                onChange(theme.id)
              }
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
                active
                  ? "nexa-theme-border shadow-lg"
                  : "border-[color:var(--nexa-border)]"
              }`}
              style={{
                background: active
                  ? "var(--nexa-surface-strong)"
                  : "var(--nexa-surface-soft)",
                backdropFilter:
                  "blur(18px)",
                WebkitBackdropFilter:
                  "blur(18px)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent opacity-70" />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className="h-10 w-10 rounded-full border shadow-inner"
                    style={{
                      background:
                        `linear-gradient(135deg, ${theme.preview}, ${theme.preview}cc)`,
                      borderColor:
                        "var(--nexa-border-strong)",
                    }}
                  />

                  {active && (
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        background:
                          "var(--nexa-accent)",
                        color:
                          theme.id === "white"
                            ? "#ffffff"
                            : "#050505",
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-[color:var(--nexa-text)]">
                  {theme.name}
                </p>

                <p className="mt-1 text-xs leading-5 text-[color:var(--nexa-muted)]">
                  {theme.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
