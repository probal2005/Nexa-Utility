import { localStorageAdapter } from "@/lib/storage";

import type { Photo } from "../types";

export const PHOTOS_STORAGE_KEY =
  "nexa-utility-photos";

export function getStoredPhotos(): Photo[] {
  const stored =
    localStorageAdapter.get<unknown>(
      PHOTOS_STORAGE_KEY,
    );

  return Array.isArray(stored)
    ? (stored as Photo[])
    : [];
}

export function savePhotos(
  photos: Photo[],
): void {
  localStorageAdapter.set(
    PHOTOS_STORAGE_KEY,
    photos,
  );
}

export function deleteStoredPhoto(
  id: string,
): Photo[] {
  const photos = getStoredPhotos();

  const nextPhotos = photos.filter(
    (photo) => photo.id !== id,
  );

  localStorageAdapter.set(
    PHOTOS_STORAGE_KEY,
    nextPhotos,
  );

  return nextPhotos;
}

export function clearStoredPhotos(): void {
  localStorageAdapter.remove(
    PHOTOS_STORAGE_KEY,
  );
}

export function loadPhotos(): Photo[] {
  return getStoredPhotos();
}

export function deletePhoto(
  id: string,
): void {
  deleteStoredPhoto(id);
}

export function clearPhotos(): void {
  clearStoredPhotos();
}

export function downloadPhoto(
  photo: Photo,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const link =
    document.createElement("a");

  link.href = photo.dataUrl;
  link.download =
    `nexa-photo-${photo.id}.png`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatPhotoDate(
  createdAt: string,
): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );
}
