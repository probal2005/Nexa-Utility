'use client';

import {
  Download,
  ExternalLink,
  File,
  X,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import type {
  StoredFile,
} from '../types';

import {
  formatFileSize,
} from '../lib/files';

type FilePreviewProps = {
  file: StoredFile | null;
  onClose: () => void;
};

export function FilePreview({
  file,
  onClose,
}: FilePreviewProps) {
  const [url, setUrl] =
    useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }

    const objectUrl =
      URL.createObjectURL(
        file.blob,
      );

    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [file]);

  if (!file) {
    return null;
  }

  const isImage =
    file.category === 'image';

  const isVideo =
    file.category === 'video';

  const isAudio =
    file.category === 'audio';

  const isPdf =
    file.type ===
      'application/pdf' ||
    file.name
      .toLowerCase()
      .endsWith('.pdf');

  const isText =
    file.category === 'code' ||
    file.type.startsWith(
      'text/',
    );

  const downloadFile = () => {
    if (!url) {
      return;
    }

    const anchor =
      document.createElement('a');

    anchor.href = url;
    anchor.download = file.name;
    anchor.click();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {file.name}
            </h2>

            <p className="mt-1 text-xs text-white/35">
              {formatFileSize(
                file.size,
              )}{' '}
              · {file.type}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={
                downloadFile
              }
              className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Download file"
            >
              <Download className="h-4 w-4" />
            </button>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                aria-label="Open file in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
          {url && isImage && (
            <img
              src={url}
              alt={file.name}
              className="max-h-[65vh] max-w-full rounded-xl object-contain"
            />
          )}

          {url && isVideo && (
            <video
              src={url}
              controls
              className="max-h-[65vh] max-w-full rounded-xl"
            />
          )}

          {url && isAudio && (
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.04] p-8">
              <File className="mx-auto mb-5 h-12 w-12 text-white/30" />

              <p className="mb-5 text-center text-sm text-white/60">
                {file.name}
              </p>

              <audio
                src={url}
                controls
                className="w-full"
              />
            </div>
          )}

          {url && isPdf && (
            <iframe
              src={url}
              title={file.name}
              className="h-[65vh] w-full rounded-xl border border-white/10 bg-white"
            />
          )}

          {isText && (
            <TextPreview
              file={file}
            />
          )}

          {!isImage &&
            !isVideo &&
            !isAudio &&
            !isPdf &&
            !isText && (
              <div className="flex flex-col items-center text-center">
                <File className="mb-4 h-16 w-16 text-white/20" />

                <p className="text-sm text-white/50">
                  Preview is not available
                  for this file type.
                </p>

                <button
                  type="button"
                  onClick={
                    downloadFile
                  }
                  className="mt-4 rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  Download File
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function TextPreview({
  file,
}: {
  file: StoredFile;
}) {
  const [content, setContent] =
    useState<string>('');
  const [error, setError] =
    useState<string | null>(
      null,
    );

  useEffect(() => {
    let active = true;

    file.blob
      .text()
      .then((value) => {
        if (active) {
          setContent(value);
        }
      })
      .catch(() => {
        if (active) {
          setError(
            'Unable to read this file.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [file]);

  if (error) {
    return (
      <p className="text-sm text-red-300">
        {error}
      </p>
    );
  }

  return (
    <pre className="max-h-[65vh] w-full overflow-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-left text-xs leading-6 text-white/70">
      {content}
    </pre>
  );
}
