import { emit } from "@/lib/events";
import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

const LEGACY_SHORTCUTS_KEY =
  "nexa-utility-sidebar-shortcuts";

export const DEFAULT_SHORTCUTS = [
  "clock",
  "calculator",
  "calendar",
  "notes",
];

function isShortcutList(
  value: unknown,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => typeof item === "string",
    )
  );
}

/**
 * Loads sidebar shortcuts from the unified
 * storage key.
 *
 * Existing users may still have the old
 * "nexa-utility-sidebar-shortcuts" key.
 * When found, it is migrated automatically.
 */
export function loadShortcuts(): string[] {
  const stored = localStorageAdapter.get<unknown>(
    STORAGE_KEYS.shortcuts,
  );

  if (isShortcutList(stored)) {
    return stored;
  }

  const legacy =
    localStorageAdapter.get<unknown>(
      LEGACY_SHORTCUTS_KEY,
    );

  if (isShortcutList(legacy)) {
    localStorageAdapter.set(
      STORAGE_KEYS.shortcuts,
      legacy,
    );

    localStorageAdapter.remove(
      LEGACY_SHORTCUTS_KEY,
    );

    return legacy;
  }

  return DEFAULT_SHORTCUTS;
}

export function saveShortcuts(
  shortcuts: string[],
): void {
  localStorageAdapter.set(
    STORAGE_KEYS.shortcuts,
    shortcuts,
  );

  emit("shortcuts:changed");
}
