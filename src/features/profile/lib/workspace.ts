import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

function getArrayLength<T>(key: string): number {
  const value =
    localStorageAdapter.get<T[]>(key);

  return Array.isArray(value)
    ? value.length
    : 0;
}

export type WorkspaceStats = {
  notes: number;
  tasks: number;
  reminders: number;
  calendarEvents: number;
};

export function loadWorkspaceStats(): WorkspaceStats {
  return {
    notes: getArrayLength(STORAGE_KEYS.notes),
    tasks: getArrayLength(STORAGE_KEYS.tasks),
    reminders: getArrayLength(
      STORAGE_KEYS.reminders,
    ),
    calendarEvents: getArrayLength(
      STORAGE_KEYS.calendarEvents,
    ),
  };
}
