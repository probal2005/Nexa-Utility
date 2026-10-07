import type { NexaNotification } from "@/lib/notifications/types";
import { loadSettings } from "@/features/settings/lib/settings";
import { isNexaPermissionEnabled } from "@/features/privacy/lib/access";

export function supportsBrowserNotifications(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window
  );
}

export function getBrowserNotificationPermission(): NotificationPermission {
  if (!supportsBrowserNotifications()) {
    return "denied";
  }

  return window.Notification.permission;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (!supportsBrowserNotifications()) {
    return "denied";
  }

  if (!isNexaPermissionEnabled("notifications")) {
    return "denied";
  }

  if (window.Notification.permission === "granted") {
    return "granted";
  }

  if (window.Notification.permission === "denied") {
    return "denied";
  }

  return window.Notification.requestPermission();
}

export function showBrowserNotification(
  notification: NexaNotification,
): boolean {
  if (!supportsBrowserNotifications()) {
    return false;
  }

  /*
   * Privacy Center permission-level control.
   *
   * This does not revoke the browser's permission.
   * It prevents Nexa from using the permission.
   */
  if (!isNexaPermissionEnabled("notifications")) {
    return false;
  }

  /*
   * Global Nexa notification preference.
   */
  const settings = loadSettings();

  if (!settings.notificationsEnabled) {
    return false;
  }

  /*
   * Browser-level permission.
   */
  if (window.Notification.permission !== "granted") {
    return false;
  }

  const browserNotification =
    new window.Notification(
      notification.title,
      {
        body:
          notification.message ||
          "Nexa Utility notification",
        tag: `nexa-${notification.type}-${notification.id}`,
      },
    );

  browserNotification.onclick = () => {
    window.focus();

    if (notification.action?.href) {
      window.location.href =
        notification.action.href;
    }

    browserNotification.close();
  };

  return true;
}
