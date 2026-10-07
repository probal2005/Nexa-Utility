import type {
  NexaPermissionId,
  NexaPermissionState,
} from "../types";

function normalizeState(
  state: PermissionState | NotificationPermission | undefined,
): NexaPermissionState {
  if (!state) {
    return "unknown";
  }

  switch (state) {
    case "granted":
      return "granted";

    case "denied":
      return "denied";

    case "prompt":
    case "default":
      return "prompt";

    default:
      return "unknown";
  }
}

export async function getPermissionState(
  permission: NexaPermissionId,
): Promise<NexaPermissionState> {
  if (typeof window === "undefined") {
    return "unknown";
  }

  if (permission === "notifications") {
    if (!("Notification" in window)) {
      return "unsupported";
    }

    return normalizeState(window.Notification.permission);
  }

  if (!("permissions" in navigator)) {
    return "unknown";
  }

  try {
    const permissionName =
      permission === "camera"
        ? "camera"
        : permission === "microphone"
          ? "microphone"
          : "geolocation";

    const result = await navigator.permissions.query({
      name: permissionName as PermissionName,
    });

    return normalizeState(result.state);
  } catch {
    return "unknown";
  }
}

export async function requestPermission(
  permission: NexaPermissionId,
): Promise<NexaPermissionState> {
  if (typeof window === "undefined") {
    return "unknown";
  }

  try {
    switch (permission) {
      case "notifications": {
        if (!("Notification" in window)) {
          return "unsupported";
        }

        const result =
          await window.Notification.requestPermission();

        return normalizeState(result);
      }

      case "camera": {
        if (!navigator.mediaDevices?.getUserMedia) {
          return "unsupported";
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
          });

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        return "granted";
      }

      case "microphone": {
        if (!navigator.mediaDevices?.getUserMedia) {
          return "unsupported";
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            audio: true,
          });

        stream.getTracks().forEach((track) => {
          track.stop();
        });

        return "granted";
      }

      case "location": {
        if (!navigator.geolocation) {
          return "unsupported";
        }

        return await new Promise<NexaPermissionState>(
          (resolve) => {
            navigator.geolocation.getCurrentPosition(
              () => resolve("granted"),
              (error) => {
                if (
                  error.code ===
                  error.PERMISSION_DENIED
                ) {
                  resolve("denied");
                } else {
                  resolve("unknown");
                }
              },
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000,
              },
            );
          },
        );
      }

      default:
        return "unknown";
    }
  } catch {
    return "denied";
  }
}
