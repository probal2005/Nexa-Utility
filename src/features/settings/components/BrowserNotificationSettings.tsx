"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  BellOff,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  supportsBrowserNotifications,
} from "@/lib/notifications/browser/notifications";
import { useSettings } from "@/features/settings/hooks/useSettings";

type PermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

export function BrowserNotificationSettings() {
  const { settings } = useSettings();
  const [permission, setPermission] =
    useState<PermissionState>("default");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!supportsBrowserNotifications()) {
      setPermission("unsupported");
      return;
    }

    setPermission(getBrowserNotificationPermission());
  }, []);

  async function handleEnable() {
    setRequesting(true);

    try {
      const nextPermission =
        await requestBrowserNotificationPermission();

      setPermission(nextPermission);
    } finally {
      setRequesting(false);
    }
  }

  if (!supportsBrowserNotifications()) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-start gap-3">
          <BellOff className="mt-0.5 h-5 w-5 text-white/50" />

          <div>
            <p className="font-medium text-white">
              Desktop notifications unavailable
            </p>

            <p className="mt-1 text-sm text-white/50">
              This browser does not support native notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!settings.notificationsEnabled) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-start gap-3">
          <BellOff className="mt-0.5 h-5 w-5 text-white/50" />

          <div>
            <p className="font-medium text-white">
              Notifications are disabled
            </p>

            <p className="mt-1 text-sm text-white/50">
              Enable Nexa notifications above before enabling
              desktop notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === "granted") {
    return (
      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400" />

          <div>
            <p className="font-medium text-white">
              Desktop notifications enabled
            </p>

            <p className="mt-1 text-sm text-white/50">
              Nexa can now show native browser notifications for
              supported events.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === "denied") {
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-400" />

          <div>
            <p className="font-medium text-white">
              Desktop notifications are blocked
            </p>

            <p className="mt-1 text-sm text-white/50">
              Your browser has blocked notifications for Nexa.
              Allow notifications from the browser&apos;s site
              permissions and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-white/70" />

          <div>
            <p className="font-medium text-white">
              Desktop notifications
            </p>

            <p className="mt-1 text-sm text-white/50">
              Get native browser notifications when reminders,
              tasks, calendar events, and other Nexa events occur.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleEnable}
          disabled={requesting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {requesting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Enable
            </>
          )}
        </button>
      </div>
    </div>
  );
}
