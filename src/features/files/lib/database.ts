import Dexie, {
  type Table,
} from 'dexie';

import type {
  StoredFile,
} from '../types';

class NexaFilesDatabase
  extends Dexie {
  files!: Table<
    StoredFile,
    string
  >;

  constructor() {
    super('nexa-utility-files');

    this.version(1).stores({
      files:
        'id, name, category, type, size, createdAt, updatedAt',
    });
  }
}

export const filesDatabase =
  new NexaFilesDatabase();

export async function getAllFiles() {
  return filesDatabase.files.toArray();
}

export async function saveFile(
  file: StoredFile,
) {
  await filesDatabase.files.put(file);
}

export async function saveFiles(
  files: StoredFile[],
) {
  await filesDatabase.files.bulkPut(files);
}

export async function deleteFile(
  id: string,
) {
  await filesDatabase.files.delete(id);
}

export async function deleteFiles(
  ids: string[],
) {
  await filesDatabase.files.bulkDelete(ids);
}

export async function clearFiles() {
  await filesDatabase.files.clear();
}

export async function getFile(
  id: string,
) {
  return filesDatabase.files.get(id);
}
