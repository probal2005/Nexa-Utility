import Dexie, { type Table } from "dexie";

import type { VoiceRecording } from "../types";

class RecorderDatabase extends Dexie {
  recordings!: Table<VoiceRecording, string>;

  constructor() {
    super("nexa-utility-recorder");

    this.version(1).stores({
      recordings: "id, createdAt, name",
    });
  }
}

export const recorderDatabase = new RecorderDatabase();
