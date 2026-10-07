import type { StorageAdapter } from "./types";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export const sessionStorageAdapter: StorageAdapter = {
  get<T>(key: string): T | null {
    const storage = getStorage();

    if (!storage) {
      return null;
    }

    try {
      const value = storage.getItem(key);

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save session storage key "${key}".`, error);
    }
  },

  remove(key: string): void {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove session storage key "${key}".`, error);
    }
  },

  has(key: string): boolean {
    const storage = getStorage();

    if (!storage) {
      return false;
    }

    return storage.getItem(key) !== null;
  },

  clear(): void {
    const storage = getStorage();

    if (!storage) {
      return;
    }

    try {
      storage.clear();
    } catch (error) {
      console.error("Failed to clear session storage.", error);
    }
  },
};
