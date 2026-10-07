"use client";

import { useCallback, useEffect, useState } from "react";

import { on } from "@/lib/events";

import {
  isNexaPermissionEnabled,
  setNexaPermissionEnabled,
} from "../lib/access";
import {
  getPermissionState,
  requestPermission,
} from "../lib/permissions";
import type {
  NexaPermission,
  NexaPermissionId,
} from "../types";

const PERMISSION_DETAILS: Omit<NexaPermission, "state" | "nexaEnabled">[] = [
  {
    id: "notifications",
    name: "Notifications",
    description: "Allow Nexa Utility to send browser notifications.",
    icon: "bell",
    usedBy: ["Notifications", "Reminders"],
  },
  {
    id: "camera",
    name: "Camera",
    description: "Allow camera features to capture photos and scan documents.",
    icon: "camera",
    usedBy: ["Camera", "QR Scanner", "Barcode Scanner", "Document Scanner", "Measure"],
  },
  {
    id: "microphone",
    name: "Microphone",
    description: "Allow audio features to record sound.",
    icon: "mic",
    usedBy: ["Voice Recorder"],
  },
  {
    id: "location",
    name: "Location",
    description: "Allow location-aware features to use your current location.",
    icon: "map-pin",
    usedBy: ["Maps", "Weather"],
  },
];

export function usePermissions() {
  const [permissions, setPermissions] = useState<NexaPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState<NexaPermissionId | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const nextPermissions = await Promise.all(
        PERMISSION_DETAILS.map(async (permission) => ({
          ...permission,
          state: await getPermissionState(permission.id),
          nexaEnabled: isNexaPermissionEnabled(permission.id),
        })),
      );

      setPermissions(nextPermissions);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    return on("permissions:changed", () => void refresh());
  }, [refresh]);

  const request = useCallback(
    async (permission: NexaPermissionId) => {
      setRequesting(permission);

      try {
        await requestPermission(permission);
        await refresh();
      } finally {
        setRequesting(null);
      }
    },
    [refresh],
  );

  const toggle = useCallback((permission: NexaPermissionId) => {
    const current = isNexaPermissionEnabled(permission);
    setNexaPermissionEnabled(permission, !current);
  }, []);

  return {
    permissions,
    loading,
    requesting,
    request,
    refresh,
    toggle,
  };
}
