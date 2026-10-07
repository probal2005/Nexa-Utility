export type NexaPermissionId =
  | "notifications"
  | "camera"
  | "microphone"
  | "location";

export type NexaPermissionState =
  | "granted"
  | "denied"
  | "prompt"
  | "unsupported"
  | "unknown";

export type NexaPermission = {
  id: NexaPermissionId;
  name: string;
  description: string;
  icon: string;
  state: NexaPermissionState;
  usedBy: string[];
  nexaEnabled?: boolean;
};
