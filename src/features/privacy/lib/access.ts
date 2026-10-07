import { emit } from "@/lib/events";
import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

import type { NexaPermissionId } from "../types";

type NexaPermissionSettings = Record<
  NexaPermissionId,
  boolean
>;

const DEFAULT_SETTINGS: NexaPermissionSettings = {
  notifications: true,
  camera: true,
  microphone: true,
  location: true,
};

function loadSettings(): NexaPermissionSettings {
  const stored =
    localStorageAdapter.get<unknown>(
      STORAGE_KEYS.permissions,
    );

  if (!stored || typeof stored !== "object") {
    return DEFAULT_SETTINGS;
  }

  const parsed =
    stored as Partial<NexaPermissionSettings>;

  return {
    notifications:
      typeof parsed.notifications === "boolean"
        ? parsed.notifications
        : true,

    camera:
      typeof parsed.camera === "boolean"
        ? parsed.camera
        : true,

    microphone:
      typeof parsed.microphone === "boolean"
        ? parsed.microphone
        : true,

    location:
      typeof parsed.location === "boolean"
        ? parsed.location
        : true,
  };
}

export function isNexaPermissionEnabled(
  permission: NexaPermissionId,
): boolean {
  return loadSettings()[permission];
}

export function setNexaPermissionEnabled(
  permission: NexaPermissionId,
  enabled: boolean,
): void {
  const current = loadSettings();

  const next = {
    ...current,
    [permission]: enabled,
  };

  localStorageAdapter.set(
    STORAGE_KEYS.permissions,
    next,
  );

  emit("permissions:changed");
}
