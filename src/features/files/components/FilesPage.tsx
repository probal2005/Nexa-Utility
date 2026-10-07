'use client';

import {
  FileArchive,
  FileCode2,
  FileImage,
  FileText,
  Files,
  HardDrive,
  Music2,
  Search,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';

import {
  useRef,
  useState,
} from 'react';

import {
  FileCard,
} from './FileCard';

import {
  FilePreview,
} from './FilePreview';

import {
  useFiles,
} from '../hooks/useFiles';

import type {
  FileCategory,
  StoredFile,
} from '../types';

import {
  formatFileSize,
} from '../lib/files';

const categories: {
  value:
    | FileCategory
    | 'all';
  label: string;
  icon: typeof Files;
}[] = [
  {
    value: 'all',
    label: 'All files',
    icon: Files,
  },
  {
    value: 'image',
    label: 'Images',
    icon: FileImage,
  },
  {
    value: 'document',
    label: 'Documents',
    icon: FileText,
  },
  {
    value: 'video',
    label: 'Videos',
    icon: Video,
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: Music2,
  },
  {
    value: 'archive',
    label: 'Archives',
    icon: FileArchive,
  },
  {
    value: 'code',
    label: 'Code',
    icon: FileCode2,
  },
];

export function FilesPage() {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const [previewFile, setPreviewFile] =
    useState<StoredFile | null>(
      null,
    );

  const {
    filteredFiles,
    search,
    category,
    sort,
    loading,
    error,
    stats,
    setSearch,
    setCategory,
    setSort,
    addFiles,
    removeFile,
    removeAllFiles,
  } = useFiles();

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      void addFiles(
        event.target.files,
      );
    }

    event.target.value = '';
  };

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                <Files className="h-5 w-5 text-white" />
              </div>

              <span className="text-sm text-white/40">
                Tools
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Files
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
              Manage your important files
              locally inside Nexa Utility.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                inputRef.current?.click()
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Upload className="h-4 w-4" />
              Import Files
            </button>

            {stats.total > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Delete all imported files from Nexa Utility?',
                    )
                  ) {
                    void removeAllFiles();
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/55 transition hover:bg-red-400/10 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Files}
            label="Files"
            value={String(
              stats.total,
            )}
          />

          <StatCard
            icon={HardDrive}
            label="Stored size"
            value={formatFileSize(
              stats.totalSize,
            )}
          />

          <StatCard
            icon={FileImage}
            label="Images"
            value={String(
              stats.counts.image,
            )}
          />

          <StatCard
            icon={FileText}
            label="Documents"
            value={String(
              stats.counts.document,
            )}
          />
        </div>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search files..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/20"
            />
          </div>

          <select
            value={sort}
            onChange={(event) =>
              setSort(
                event.target.value as
                  | 'name'
                  | 'size'
                  | 'newest'
                  | 'oldest'
                  | 'type',
              )
            }
            className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none"
          >
            <option
              value="newest"
              className="bg-[#101010]"
            >
              Newest
            </option>

            <option
              value="oldest"
              className="bg-[#101010]"
            >
              Oldest
            </option>

            <option
              value="name"
              className="bg-[#101010]"
            >
              Name
            </option>

            <option
              value="size"
              className="bg-[#101010]"
            >
              Size
            </option>

            <option
              value="type"
              className="bg-[#101010]"
            >
              Type
            </option>
          </select>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {categories.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                category ===
                item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() =>
                    setCategory(
                      item.value,
                    )
                  }
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition ${
                    active
                      ? 'bg-white text-black'
                      : 'border border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />

                  {item.label}
                </button>
              );
            },
          )}
        </div>

        {loading ? (
          <div className="flex min-h-72 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025]">
            <p className="text-sm text-white/35">
              Loading files...
            </p>
          </div>
        ) : filteredFiles.length ===
          0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 text-center">
            <Files className="mb-4 h-12 w-12 text-white/15" />

            <h2 className="text-base font-medium text-white/70">
              {search ||
              category !== 'all'
                ? 'No matching files'
                : 'Your file space is empty'}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/30">
              {search ||
              category !== 'all'
                ? 'Try another search or category.'
                : 'Import files to keep them available locally in Nexa Utility.'}
            </p>

            {!search &&
              category ===
                'all' && (
                <button
                  type="button"
                  onClick={() =>
                    inputRef.current?.click()
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
                >
                  <Upload className="h-4 w-4" />
                  Import your first file
                </button>
              )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredFiles.map(
              (file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDelete={
                    removeFile
                  }
                  onOpen={
                    setPreviewFile
                  }
                />
              ),
            )}
          </div>
        )}

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
          <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-white/35" />

          <div>
            <p className="text-sm font-medium text-white/65">
              Local-first storage
            </p>

            <p className="mt-1 text-xs leading-5 text-white/30">
              Imported files are stored in
              your browser&apos;s IndexedDB
              storage. They are not uploaded
              to a Nexa server.
            </p>
          </div>
        </div>
      </main>

      <FilePreview
        file={previewFile}
        onClose={() =>
          setPreviewFile(null)
        }
      />
    </>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Files;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
          <Icon className="h-4 w-4 text-white/55" />
        </div>

        <div>
          <p className="text-xs text-white/30">
            {label}
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
