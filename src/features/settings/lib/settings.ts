import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";
import type {
  NexaSettings,
  NexaTheme,
} from "../types";

export const SETTINGS_STORAGE_KEY = STORAGE_KEYS.settings;

const VALID_THEMES: NexaTheme[] = [
  "black",
  "white",
  "midnight",
  "ocean",
  "forest",
];

export const DEFAULT_SETTINGS: NexaSettings = {
  theme: "black",

  sidebar: {
    showShortcuts: true,
    showCategories: true,
    compact: false,
  },

  commandPaletteEnabled: true,
  commandPaletteShortcut: "Ctrl+K",
  notificationsEnabled: true,
  clock24Hour: false,

  displayName: "",
};

function normalizeTheme(value: unknown): NexaTheme {
  if (value === "dark") {
    return "black";
  }

  if (value === "light") {
    return "white";
  }

  if (
    typeof value === "string" &&
    VALID_THEMES.includes(value as NexaTheme)
  ) {
    return value as NexaTheme;
  }

  return DEFAULT_SETTINGS.theme;
}

function normalizeSettings(
  value: Partial<NexaSettings> | null | undefined,
): NexaSettings {
  if (!value) {
    return DEFAULT_SETTINGS;
  }

  return {
    ...DEFAULT_SETTINGS,
    ...value,

    theme: normalizeTheme(value.theme),

    sidebar: {
      ...DEFAULT_SETTINGS.sidebar,
      ...(value.sidebar ?? {}),
    },

    commandPaletteEnabled:
      typeof value.commandPaletteEnabled === "boolean"
        ? value.commandPaletteEnabled
        : DEFAULT_SETTINGS.commandPaletteEnabled,

    commandPaletteShortcut:
      typeof value.commandPaletteShortcut === "string" &&
      value.commandPaletteShortcut.trim().length > 0
        ? value.commandPaletteShortcut
        : DEFAULT_SETTINGS.commandPaletteShortcut,

    notificationsEnabled:
      typeof value.notificationsEnabled === "boolean"
        ? value.notificationsEnabled
        : DEFAULT_SETTINGS.notificationsEnabled,

    clock24Hour:
      typeof value.clock24Hour === "boolean"
        ? value.clock24Hour
        : DEFAULT_SETTINGS.clock24Hour,

    displayName:
      typeof value.displayName === "string"
        ? value.displayName.slice(0, 40)
        : DEFAULT_SETTINGS.displayName,
  };
}

export function loadSettings(): NexaSettings {
  const stored =
    localStorageAdapter.get<Partial<NexaSettings>>(
      SETTINGS_STORAGE_KEY,
    );

  return normalizeSettings(stored);
}

export function saveSettings(settings: NexaSettings): void {
  const normalized = normalizeSettings(settings);

  localStorageAdapter.set(
    SETTINGS_STORAGE_KEY,
    normalized,
  );
}

export function resetSettings(): NexaSettings {
  localStorageAdapter.remove(SETTINGS_STORAGE_KEY);

  return DEFAULT_SETTINGS;
}

export const THEMES: Array<{
  id: NexaTheme;
  name: string;
  description: string;
}> = [
  {
    id: "black",
    name: "Black",
    description: "Pure dark interface with high contrast.",
  },
  {
    id: "white",
    name: "White",
    description: "Clean light interface.",
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Deep blue-black workspace.",
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Cool blue glass interface.",
  },
  {
    id: "forest",
    name: "Forest",
    description: "Deep green workspace.",
  },
];
