export interface StorageAdapter {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  has(key: string): boolean;
  clear(): void;
}

export interface AsyncStorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
}
