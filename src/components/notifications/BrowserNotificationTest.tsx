"use client";

import { useState } from "react";
import { Bell, CheckCircle2, Loader2 } from "lucide-react";
import { requestBrowserNotificationPermission } from "@/lib/notifications/browser/notifications";
import { notify } from "@/lib/notifications/engine";

export function BrowserNotificationTest() {
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  async function handleTest() {
    setTesting(true);
    setMessage("");

    try {
      const permission =
        await requestBrowserNotificationPermission();

      if (permission !== "granted") {
        setMessage(
          permission === "denied"
            ? "Browser notification permission is blocked."
            : "Browser notification permission was not granted.",
        );
        return;
      }

      notify({
        type: "system",
        title: "Nexa Notification Test",
        message:
          "Your Nexa desktop notifications are working successfully. 🔔",
        priority: "normal",
        action: {
          label: "Open Nexa",
          href: "/",
        },
      });

      setMessage("Test notification sent successfully.");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Bell className="mt-0.5 h-5 w-5 text-white/70" />

          <div>
            <p className="font-medium text-white">
              Test desktop notification
            </p>

            <p className="mt-1 text-sm text-white/50">
              Send a real native browser notification to verify
              that Nexa notification delivery is working.
            </p>

            {message && (
              <p className="mt-2 flex items-center gap-2 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                {message}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleTest}
          disabled={testing}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.14] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            <>
              <Bell className="h-4 w-4" />
              Send Test
            </>
          )}
        </button>
      </div>
    </div>
  );
}
