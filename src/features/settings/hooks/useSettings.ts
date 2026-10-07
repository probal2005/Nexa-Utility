"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { emit, on } from "@/lib/events";

import type {
  NexaSettings,
  NexaTheme,
  SidebarSettings,
} from "../types";

import {
  DEFAULT_SETTINGS,
  loadSettings,
  resetSettings as resetStoredSettings,
  saveSettings,
} from "../lib/settings";

type SettingsUpdater =
  | Partial<NexaSettings>
  | ((current: NexaSettings) => NexaSettings);

export function useSettings() {
  const [settings, setSettings] =
    useState<NexaSettings>(DEFAULT_SETTINGS);

  const [hydrated, setHydrated] =
    useState(false);

  useEffect(() => {
    const storedSettings = loadSettings();

    setSettings(storedSettings);
    setHydrated(true);

    return on("settings:changed", () => {
      setSettings(loadSettings());
    });
  }, []);

  const updateSettings = useCallback(
    (updates: SettingsUpdater) => {
      const current = loadSettings();

      const next =
        typeof updates === "function"
          ? updates(current)
          : {
              ...current,
              ...updates,
            };

      saveSettings(next);
      setSettings(next);
      emit("settings:changed");
    },
    [],
  );

  const setTheme = useCallback(
    (theme: NexaTheme) => {
      updateSettings({
        theme,
      });
    },
    [updateSettings],
  );

  const updateSidebar = useCallback(
    (updates: Partial<SidebarSettings>) => {
      updateSettings((current) => ({
        ...current,

        sidebar: {
          ...current.sidebar,
          ...updates,
        },
      }));
    },
    [updateSettings],
  );

  const setDisplayName = useCallback(
    (displayName: string) => {
      updateSettings({
        displayName:
          displayName.slice(0, 40),
      });
    },
    [updateSettings],
  );

  const setCommandPaletteEnabled =
    useCallback(
      (enabled: boolean) => {
        updateSettings({
          commandPaletteEnabled:
            enabled,
        });
      },
      [updateSettings],
    );

  const setCommandPaletteShortcut =
    useCallback(
      (shortcut: string) => {
        updateSettings({
          commandPaletteShortcut:
            shortcut,
        });
      },
      [updateSettings],
    );

  const setNotificationsEnabled =
    useCallback(
      (enabled: boolean) => {
        updateSettings({
          notificationsEnabled:
            enabled,
        });
      },
      [updateSettings],
    );

  const setClock24Hour = useCallback(
    (enabled: boolean) => {
      updateSettings({
        clock24Hour: enabled,
      });
    },
    [updateSettings],
  );

  const resetAllSettings = useCallback(() => {
    const next = resetStoredSettings();

    setSettings(next);

    emit("settings:changed");

    return next;
  }, []);

  return {
    settings,

    // Keep both names for compatibility.
    hydrated,
    loaded: hydrated,

    updateSettings,

    setTheme,
    updateSidebar,
    setDisplayName,

    setCommandPaletteEnabled,
    setCommandPaletteShortcut,

    setNotificationsEnabled,
    setClock24Hour,

    // Preserve the existing SettingsPage API.
    resetAllSettings,

    // Also expose the shorter name for future consumers.
    resetSettings: resetAllSettings,
  };
}
