"use client";

import { useCallback, useEffect, useState } from "react";

import { recorderDatabase } from "../lib/database";

import type { VoiceRecording } from "../types";

export function useRecordings() {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const items = await recorderDatabase.recordings
      .orderBy("createdAt")
      .reverse()
      .toArray();

    setRecordings(items);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const items = await recorderDatabase.recordings
          .orderBy("createdAt")
          .reverse()
          .toArray();

        if (active) {
          setRecordings(items);
          setHydrated(true);
        }
      } catch {
        if (active) {
          setHydrated(true);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  const addRecording = useCallback(
    async (recording: VoiceRecording) => {
      await recorderDatabase.recordings.put(recording);
      await refresh();
    },
    [refresh],
  );

  const renameRecording = useCallback(
    async (id: string, name: string) => {
      const cleanName = name.trim();

      if (!cleanName) {
        return;
      }

      await recorderDatabase.recordings.update(id, {
        name: cleanName,
      });

      await refresh();
    },
    [refresh],
  );

  const deleteRecording = useCallback(
    async (id: string) => {
      await recorderDatabase.recordings.delete(id);
      await refresh();
    },
    [refresh],
  );

  const clearRecordings = useCallback(async () => {
    await recorderDatabase.recordings.clear();
    await refresh();
  }, [refresh]);

  return {
    recordings,
    hydrated,
    addRecording,
    renameRecording,
    deleteRecording,
    clearRecordings,
    refresh,
  };
}
