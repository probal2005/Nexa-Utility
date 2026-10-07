import { nexaDatabase } from "./database";
import type { AsyncStorageAdapter } from "./types";

export const indexedDBStorage: AsyncStorageAdapter = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const record = await nexaDatabase.storage.get(key);

      if (!record) {
        return null;
      }

      return record.value as T;
    } catch (error) {
      console.error(`Failed to read IndexedDB key "${key}".`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await nexaDatabase.storage.put({
        key,
        value,
        updatedAt: Date.now(),
      });
    } catch (error) {
      console.error(`Failed to save IndexedDB key "${key}".`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await nexaDatabase.storage.delete(key);
    } catch (error) {
      console.error(`Failed to remove IndexedDB key "${key}".`, error);
    }
  },

  async has(key: string): Promise<boolean> {
    try {
      const count = await nexaDatabase.storage
        .where("key")
        .equals(key)
        .count();

      return count > 0;
    } catch (error) {
      console.error(`Failed to check IndexedDB key "${key}".`, error);
      return false;
    }
  },

  async clear(): Promise<void> {
    try {
      await nexaDatabase.storage.clear();
    } catch (error) {
      console.error("Failed to clear IndexedDB storage.", error);
    }
  },
};
