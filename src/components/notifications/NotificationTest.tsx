"use client";

import { notify } from "@/lib/notifications";

export function NotificationTest() {
  function createTestNotification() {
    notify({
      type: "system",
      title: "Nexa Notification",
      message: "Notification engine is working correctly.",
      priority: "normal",
    });
  }

  return (
    <button
      type="button"
      onClick={createTestNotification}
      className="rounded-xl border border-[var(--nexa-border)] bg-[var(--nexa-surface)] px-4 py-2 text-sm text-[var(--nexa-text)] transition hover:border-[var(--nexa-accent)]/50 hover:bg-[var(--nexa-surface-hover)]"
    >
      Test notification
    </button>
  );
}
