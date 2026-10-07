"use client";

import Link from "next/link";
import {
  Bell,
  BellRing,
  CalendarDays,
  Check,
  CheckCheck,
  Clock3,
  ExternalLink,
  ListTodo,
  Trash2,
  X,
} from "lucide-react";
import { useNotifications } from "@/lib/notifications";
import type {
  NexaNotification,
  NotificationType,
} from "@/lib/notifications";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "reminder":
      return Clock3;
    case "calendar":
      return CalendarDays;
    case "task":
      return ListTodo;
    case "pomodoro":
      return Clock3;
    default:
      return Bell;
  }
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();

  const diff = now.getTime() - date.getTime();

  if (diff < 60_000) {
    return "Just now";
  }

  if (diff < 3_600_000) {
    return `${Math.floor(diff / 60_000)}m ago`;
  }

  if (diff < 86_400_000) {
    return `${Math.floor(diff / 3_600_000)}h ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function NotificationItem({
  notification,
  onRead,
  onDismiss,
}: {
  notification: NexaNotification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={`group relative border-b border-[var(--nexa-border)] px-4 py-4 transition-colors ${
        notification.read
          ? "bg-transparent"
          : "bg-[var(--nexa-accent-soft)]/30"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            notification.read
              ? "bg-white/[0.05] text-[var(--nexa-text-muted)]"
              : "bg-[var(--nexa-accent-soft)] text-[var(--nexa-accent)]"
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p
                className={`text-sm ${
                  notification.read
                    ? "font-medium text-[var(--nexa-text)]"
                    : "font-semibold text-[var(--nexa-text)]"
                }`}
              >
                {notification.title}
              </p>

              {notification.message && (
                <p className="mt-1 text-xs leading-5 text-[var(--nexa-text-muted)]">
                  {notification.message}
                </p>
              )}
            </div>

            <span className="shrink-0 text-[10px] text-[var(--nexa-text-muted)]">
              {formatTime(notification.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            {!notification.read && (
              <button
                type="button"
                onClick={() => onRead(notification.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--nexa-text-muted)] transition hover:bg-white/[0.06] hover:text-[var(--nexa-text)]"
              >
                <Check className="h-3 w-3" />
                Mark read
              </button>
            )}

            {notification.action && (
              <Link
                href={notification.action.href}
                onClick={() => onRead(notification.id)}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-[var(--nexa-accent)] transition hover:bg-[var(--nexa-accent-soft)]"
              >
                {notification.action.label}
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => onDismiss(notification.id)}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] text-[var(--nexa-text-muted)] opacity-0 transition hover:bg-white/[0.06] hover:text-[var(--nexa-text)] group-hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <X className="h-3 w-3" />
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markRead,
    markAllRead,
    dismiss,
    clearAll,
  } = useNotifications();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-[var(--nexa-accent)]" />
            ) : (
              <Bell className="h-5 w-5 text-[var(--nexa-text-muted)]" />
            )}

            <h1 className="text-xl font-semibold tracking-tight text-[var(--nexa-text)]">
              Notifications
            </h1>
          </div>

          <p className="mt-1 text-sm text-[var(--nexa-text-muted)]">
            {unreadCount > 0
              ? `${unreadCount} unread notification${
                  unreadCount === 1 ? "" : "s"
                }`
              : "You're all caught up."}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--nexa-border)] bg-[var(--nexa-surface)] px-3 py-2 text-xs font-medium text-[var(--nexa-text-muted)] transition hover:border-[var(--nexa-accent)]/40 hover:text-[var(--nexa-text)]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--nexa-border)] bg-[var(--nexa-surface)] px-3 py-2 text-xs font-medium text-[var(--nexa-text-muted)] transition hover:border-red-500/30 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--nexa-border)] bg-[var(--nexa-surface)]">
        {notifications.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
              <Bell className="h-6 w-6 text-[var(--nexa-text-muted)]" />
            </div>

            <h2 className="mt-4 text-sm font-semibold text-[var(--nexa-text)]">
              No notifications
            </h2>

            <p className="mt-1 max-w-sm text-xs leading-5 text-[var(--nexa-text-muted)]">
              Reminders, calendar events, tasks and other Nexa activity will
              appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={markRead}
              onDismiss={dismiss}
            />
          ))
        )}
      </div>
    </section>
  );
}
