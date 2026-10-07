"use client";

import Link from "next/link";
import { Bell, BellRing } from "lucide-react";
import { useNotifications } from "@/lib/notifications";

export function NotificationButton() {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href="/notifications"
      aria-label={
        unreadCount > 0
          ? `${unreadCount} unread notifications`
          : "Notifications"
      }
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--nexa-border)] bg-[var(--nexa-surface)] text-[var(--nexa-text-muted)] transition hover:border-[var(--nexa-accent)]/40 hover:bg-[var(--nexa-surface-hover)] hover:text-[var(--nexa-text)]"
    >
      {unreadCount > 0 ? (
        <BellRing className="h-4.5 w-4.5 text-[var(--nexa-accent)]" />
      ) : (
        <Bell className="h-4.5 w-4.5" />
      )}

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-w-4.5 h-4.5 items-center justify-center rounded-full bg-[var(--nexa-accent)] px-1 text-[9px] font-bold text-black shadow-lg">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
