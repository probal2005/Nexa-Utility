"use client";

import {
  Bell,
  Check,
  Command,
  RotateCcw,
  Settings as SettingsIcon,
  User,
  X,
} from "lucide-react";
import Link from "next/link";

import { BrowserNotificationSettings } from "./BrowserNotificationSettings";
import { BrowserNotificationTest } from "@/components/notifications/BrowserNotificationTest";
import { useEffect, useState } from "react";

import { useSettings } from "../hooks/useSettings";
import ThemeSelector from "./ThemeSelector";
import ShortcutManager from "./ShortcutManager";
import { loadProfile, saveProfile } from "@/features/profile/lib/profile";
import {
  DEFAULT_SHORTCUTS,
  loadShortcuts,
  saveShortcuts,
} from "@/features/settings/lib/shortcuts";

export default function SettingsPage() {
  const {
    settings,
    hydrated,
    setTheme,
    setDisplayName,
    updateSettings,
    resetAllSettings,
  } = useSettings();

  const [shortcuts, setShortcuts] =
    useState<string[]>(DEFAULT_SHORTCUTS);

  const [nameInput, setNameInput] =
    useState("");

  useEffect(() => {
    setShortcuts(loadShortcuts());
  }, []);

  useEffect(() => {
    if (hydrated) {
      setNameInput(settings.displayName);
    }
  }, [hydrated, settings.displayName]);

  const handleSaveShortcuts = (
    nextShortcuts: string[],
  ) => {
    setShortcuts(nextShortcuts);
    saveShortcuts(nextShortcuts);
  };

  const handleNameChange = (
    value: string,
  ) => {
    const cleaned = value
      .replace(/\s+/g, " ")
      .slice(0, 40);

    setNameInput(cleaned);

    setDisplayName(cleaned);
    saveProfile({ ...loadProfile(), displayName: cleaned });
  };

  const clearName = () => {
    setNameInput("");

    setDisplayName("");
    saveProfile({ ...loadProfile(), displayName: "" });
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-white/5" />

        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="nexa-theme-accent-soft flex h-11 w-11 items-center justify-center rounded-xl">
            <SettingsIcon className="nexa-theme-accent h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Settings
            </h1>

            <p className="text-sm text-zinc-500">
              Personalize how Nexa Utility looks and
              behaves.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-5 xl:grid-cols-2">
        {/* Profile */}
        <section className="nexa-theme-surface rounded-2xl border p-5">
          <div className="mb-6 flex items-start gap-3">
            <div className="nexa-theme-accent-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <User className="nexa-theme-accent h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Your Profile
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Tell Nexa what you&apos;d like to be called.
                Your name will appear throughout your
                personal workspace.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <label
              htmlFor="nexa-display-name"
              className="block text-sm font-medium"
            >
              Display name
            </label>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              This name is stored locally on this device
              and is used to personalize Nexa.
            </p>

            <div className="relative mt-4">
              <input
                id="nexa-display-name"
                type="text"
                value={nameInput}
                maxLength={40}
                autoComplete="name"
                placeholder="Enter your name..."
                onChange={(event) =>
                  handleNameChange(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
                className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 pr-12 text-sm text-white outline-none placeholder:text-zinc-600 transition focus:border-white/25 focus:bg-black/30"
              />

              {nameInput && (
                <button
                  type="button"
                  onClick={clearName}
                  aria-label="Clear display name"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-600">
                {nameInput
                  ? `Nexa will call you "${nameInput}".`
                  : "You can add your name anytime."}
              </p>

              <span className="shrink-0 text-xs text-zinc-600">
                {nameInput.length}/40
              </span>
            </div>

            {nameInput && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <Check className="h-4 w-4 text-emerald-400" />

                <span className="text-xs text-zinc-400">
                  Profile name saved automatically
                </span>
              </div>
            )}

            <Link
              href="/profile"
              className="mt-4 inline-flex items-center text-xs font-medium text-primary transition hover:underline"
            >
              Edit full profile details
            </Link>
          </div>
        </section>

        {/* Theme */}
        <ThemeSelector
          value={settings.theme}
          onChange={setTheme}
        />
        </div>

        <div className="grid gap-5">
        {/* Shortcuts */}
        <ShortcutManager
          shortcuts={shortcuts}
          onChange={handleSaveShortcuts}
        />
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
        {/* Preferences */}
        <section className="nexa-theme-surface rounded-2xl border p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="nexa-theme-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
              <SettingsIcon className="nexa-theme-accent h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Preferences
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Configure common Nexa behaviors.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <SettingToggle
              title="Command palette"
              description="Enable Ctrl/Cmd + K tool search."
              checked={
                settings.commandPaletteEnabled
              }
              onChange={(checked) =>
                updateSettings((current) => ({
                  ...current,
                  commandPaletteEnabled:
                    checked,
                }))
              }
            />

            <SettingToggle
              title="Notifications"
              description="Allow Nexa to use browser notifications for supported features."
              checked={
                settings.notificationsEnabled
              }
              onChange={(checked) =>
                updateSettings((current) => ({
                  ...current,
                  notificationsEnabled:
                    checked,
                }))
              }
            />

            <SettingToggle
              title="24-hour clock"
              description="Use 24-hour time throughout Nexa where supported."
              checked={
                settings.clock24Hour
              }
              onChange={(checked) =>
                updateSettings((current) => ({
                  ...current,
                  clock24Hour: checked,
                }))
              }
            />
          </div>
        </section>

        {/* Keyboard */}
        <section className="nexa-theme-surface rounded-2xl border p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="nexa-theme-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
              <Command className="nexa-theme-accent h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Keyboard Shortcuts
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Nexa navigation shortcuts.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="text-sm font-medium">
                Open command palette
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Search and open any available Nexa tool.
              </p>
            </div>

            <kbd className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-400">
              Ctrl + K
            </kbd>
          </div>
        </section>
        </div>

        {/* Notifications */}
        <section className="nexa-theme-surface rounded-2xl border p-5">
          <div className="flex items-start gap-3">
            <div className="nexa-theme-accent-soft flex h-10 w-10 items-center justify-center rounded-xl">
              <Bell className="nexa-theme-accent h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Notification Status
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {settings.notificationsEnabled
                  ? "Nexa notification features are enabled."
                  : "Nexa notifications are disabled."}
              </p>
            </div>
          </div>
        </section>

        {/* Desktop Notifications */}
        <BrowserNotificationSettings />

        {/* Notification Test */}
        <BrowserNotificationTest />

        {/* Reset */}
        <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">
                Reset Nexa Settings
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Restore your profile, theme, app dock,
                shortcuts and preferences to their
                defaults.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all Nexa Utility settings?",
                  )
                ) {
                  resetAllSettings();
                  window.location.reload();
                }
              }}
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "nexa-theme-accent-bg"
            : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />

        {checked && (
          <Check className="absolute left-1.5 top-1.5 h-3 w-3 text-black opacity-0" />
        )}
      </button>
    </div>
  );
}
