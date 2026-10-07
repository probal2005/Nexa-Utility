import type {
  FileCategory,
  StoredFile,
} from '../types';

export function getFileCategory(
  type: string,
  name: string,
): FileCategory {
  const lowerName = name.toLowerCase();

  if (type.startsWith('image/')) {
    return 'image';
  }

  if (type.startsWith('video/')) {
    return 'video';
  }

  if (type.startsWith('audio/')) {
    return 'audio';
  }

  if (
    type.includes('pdf') ||
    type.includes('word') ||
    type.includes('document') ||
    type.includes('spreadsheet') ||
    type.includes('presentation') ||
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|md|rtf)$/i.test(
      lowerName,
    )
  ) {
    return 'document';
  }

  if (
    type.includes('zip') ||
    type.includes('compressed') ||
    /\.(zip|rar|7z|tar|gz)$/i.test(
      lowerName,
    )
  ) {
    return 'archive';
  }

  if (
    type.includes('javascript') ||
    type.includes('typescript') ||
    type.includes('json') ||
    type.includes('html') ||
    type.includes('css') ||
    type.includes('python') ||
    /\.(js|jsx|ts|tsx|json|html|css|py|java|cpp|c|h|rs|go|php)$/i.test(
      lowerName,
    )
  ) {
    return 'code';
  }

  return 'other';
}

export function formatFileSize(
  bytes: number,
): string {
  if (
    !Number.isFinite(bytes) ||
    bytes <= 0
  ) {
    return '0 B';
  }

  const units = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
  ];

  const index = Math.min(
    Math.floor(
      Math.log(bytes) / Math.log(1024),
    ),
    units.length - 1,
  );

  const value =
    bytes / 1024 ** index;

  return `${value.toFixed(
    index === 0
      ? 0
      : value >= 100
        ? 0
        : 1,
  )} ${units[index]}`;
}

export function formatFileDate(
  timestamp: number,
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(timestamp));
}

export function getFileExtension(
  name: string,
): string {
  const index =
    name.lastIndexOf('.');

  if (index <= 0) {
    return '';
  }

  return name
    .slice(index + 1)
    .toUpperCase();
}

export function matchesFileSearch(
  file: StoredFile,
  query: string,
): boolean {
  if (!query.trim()) {
    return true;
  }

  const normalized =
    query.trim().toLowerCase();

  return (
    file.name
      .toLowerCase()
      .includes(normalized) ||
    file.type
      .toLowerCase()
      .includes(normalized) ||
    file.category
      .toLowerCase()
      .includes(normalized)
  );
}

export function sortFiles(
  files: StoredFile[],
  sort:
    | 'name'
    | 'size'
    | 'newest'
    | 'oldest'
    | 'type',
): StoredFile[] {
  return [...files].sort(
    (a, b) => {
      switch (sort) {
        case 'name':
          return a.name.localeCompare(
            b.name,
            undefined,
            {
              numeric: true,
              sensitivity: 'base',
            },
          );

        case 'size':
          return b.size - a.size;

        case 'oldest':
          return (
            a.createdAt -
            b.createdAt
          );

        case 'type':
          return (
            a.category.localeCompare(
              b.category,
            ) ||
            a.name.localeCompare(
              b.name,
            )
          );

        case 'newest':
        default:
          return (
            b.createdAt -
            a.createdAt
          );
      }
    },
  );
}
