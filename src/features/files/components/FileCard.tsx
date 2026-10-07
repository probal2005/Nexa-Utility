'use client';

import {
  Archive,
  Code2,
  File,
  FileText,
  Film,
  Headphones,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
} from 'lucide-react';

import type {
  FileCategory,
  StoredFile,
} from '../types';

import {
  formatFileDate,
  formatFileSize,
  getFileExtension,
} from '../lib/files';

type FileCardProps = {
  file: StoredFile;
  onDelete: (
    id: string,
  ) => void;
  onOpen: (
    file: StoredFile,
  ) => void;
};

function getIcon(
  category: FileCategory,
) {
  switch (category) {
    case 'image':
      return ImageIcon;

    case 'video':
      return Film;

    case 'audio':
      return Headphones;

    case 'document':
      return FileText;

    case 'archive':
      return Archive;

    case 'code':
      return Code2;

    default:
      return File;
  }
}

export function FileCard({
  file,
  onDelete,
  onOpen,
}: FileCardProps) {
  const Icon = getIcon(
    file.category,
  );

  const extension =
    getFileExtension(file.name);

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-white/20 hover:bg-white/[0.055]">
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() =>
            onOpen(file)
          }
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]">
            <Icon className="h-5 w-5 text-white/65" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {file.name}
            </p>

            <p className="mt-1 text-xs text-white/35">
              {extension ||
                file.category}
            </p>
          </div>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() =>
              onOpen(file)
            }
            className="rounded-lg p-2 text-white/25 opacity-0 transition hover:bg-white/10 hover:text-white group-hover:opacity-100"
            aria-label="Open file"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(file.id)
            }
            className="rounded-lg p-2 text-white/25 transition hover:bg-red-400/10 hover:text-red-300"
            aria-label={`Delete ${file.name}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/30">
        <span>
          {formatFileSize(file.size)}
        </span>

        <span>
          {formatFileDate(
            file.createdAt,
          )}
        </span>
      </div>
    </article>
  );
}
