import { emit } from "@/lib/events";
import { localStorageAdapter } from "@/lib/storage";

export const PROFILE_STORAGE_KEY =
  "nexa-utility-profile";

export type NexaProfile = {
  displayName: string;
  username: string;
  role: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
};

export const DEFAULT_PROFILE: NexaProfile = {
  displayName: "",
  username: "",
  role: "Nexa Utility User",
  bio: "Building, learning, and organizing everything in one place.",
  location: "",
  website: "",
  avatar: "",
};

export function loadProfile(): NexaProfile {
  const stored =
    localStorageAdapter.get<unknown>(
      PROFILE_STORAGE_KEY,
    );

  if (!stored || typeof stored !== "object") {
    return DEFAULT_PROFILE;
  }

  const parsed =
    stored as Partial<NexaProfile>;

  return {
    ...DEFAULT_PROFILE,
    ...parsed,
  };
}

export function saveProfile(
  profile: NexaProfile,
): void {
  localStorageAdapter.set(
    PROFILE_STORAGE_KEY,
    profile,
  );

  emit("profile:changed");
}

export function clearProfile(): void {
  localStorageAdapter.remove(
    PROFILE_STORAGE_KEY,
  );

  emit("profile:changed");
}
