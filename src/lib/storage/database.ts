import Dexie, { type Table } from "dexie";

export interface StorageRecord {
  key: string;
  value: unknown;
  updatedAt: number;
}

class NexaDatabase extends Dexie {
  storage!: Table<StorageRecord, string>;

  constructor() {
    super("nexa-utility");

    this.version(1).stores({
      storage: "key, updatedAt",
    });
  }
}

export const nexaDatabase = new NexaDatabase();
