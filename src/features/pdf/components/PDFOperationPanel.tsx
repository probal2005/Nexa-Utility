'use client';

import {
  Download,
  FilePlus,
  Loader2,
  RotateCw,
  Scissors,
  Upload,
} from 'lucide-react';

import {
  useEffect,
  useState,
} from 'react';

import type {
  PDFPageRotation,
  PDFTool,
} from '../types';

type PDFOperationPanelProps = {
  tool: PDFTool;
  isProcessing: boolean;
  onMerge: (
    files: File[],
  ) => Promise<void>;
  onSplit: (
    file: File,
    pages: number[],
  ) => Promise<void>;
  onRotate: (
    file: File,
    rotation: PDFPageRotation,
  ) => Promise<void>;
  onImagesToPDF: (
    files: File[],
  ) => Promise<void>;
};

export function PDFOperationPanel({
  tool,
  isProcessing,
  onMerge,
  onSplit,
  onRotate,
  onImagesToPDF,
}: PDFOperationPanelProps) {
  const [
    files,
    setFiles,
  ] = useState<File[]>([]);

  const [
    splitPages,
    setSplitPages,
  ] = useState('1');

  const [
    rotation,
    setRotation,
  ] = useState<PDFPageRotation>(
    90,
  );

  useEffect(() => {
    setFiles([]);
    setSplitPages('1');
  }, [tool]);

  const selectFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected =
      Array.from(
        event.target.files ?? [],
      );

    setFiles(selected);
  };

  const run = async () => {
    if (tool === 'merge') {
      await onMerge(files);
      return;
    }

    if (tool === 'images-to-pdf') {
      await onImagesToPDF(files);
      return;
    }

    if (tool === 'split') {
      if (!files[0]) {
        return;
      }

      const pages =
        splitPages
          .split(',')
          .map((page) =>
            Number(page.trim()),
          )
          .filter(
            (page) =>
              Number.isInteger(page) &&
              page > 0,
          );

      await onSplit(
        files[0],
        pages,
      );

      return;
    }

    if (tool === 'rotate') {
      if (!files[0]) {
        return;
      }

      await onRotate(
        files[0],
        rotation,
      );
    }
  };

  const acceptsImages =
    tool === 'images-to-pdf';

  const acceptsMultiple =
    tool === 'merge' ||
    tool === 'images-to-pdf';

  const hasFiles =
    files.length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
          <Upload
            size={18}
            className="text-white"
          />
        </div>

        <div>
          <h2 className="font-semibold text-white">
            {tool === 'merge'
              ? 'Select PDFs to merge'
              : tool === 'split'
                ? 'Select a PDF to split'
                : tool === 'rotate'
                  ? 'Select a PDF to rotate'
                  : 'Select images'}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Files are processed locally in
            your browser.
          </p>
        </div>
      </div>

      <label className="mt-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 px-5 text-center transition hover:border-white/20 hover:bg-white/[0.03]">
        <FilePlus
          size={25}
          className="text-zinc-500"
        />

        <span className="mt-3 text-sm font-medium text-zinc-300">
          Choose {acceptsImages
            ? 'images'
            : 'PDF files'}
        </span>

        <span className="mt-1 text-xs text-zinc-600">
          {acceptsMultiple
            ? 'Multiple files supported'
            : 'One file'}
        </span>

        <input
          type="file"
          accept={
            acceptsImages
              ? 'image/*'
              : 'application/pdf,.pdf'
          }
          multiple={acceptsMultiple}
          onChange={selectFiles}
          className="hidden"
        />
      </label>

      {hasFiles && (
        <div className="mt-4 space-y-2">
          {files.map(
            (file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-white">
                    {file.name}
                  </div>

                  <div className="mt-1 text-xs text-zinc-600">
                    {(
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)}{' '}
                    MB
                  </div>
                </div>

                <span className="ml-4 shrink-0 text-xs text-zinc-600">
                  {file.type ||
                    'file'}
                </span>
              </div>
            ),
          )}
        </div>
      )}

      {tool === 'split' && (
        <div className="mt-4">
          <label className="text-xs text-zinc-500">
            Pages to extract
          </label>

          <input
            value={splitPages}
            onChange={(event) =>
              setSplitPages(
                event.target.value,
              )
            }
            placeholder="Example: 1, 3, 5"
            className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
          />

          <p className="mt-2 text-xs text-zinc-600">
            Enter page numbers separated
            by commas.
          </p>
        </div>
      )}

      {tool === 'rotate' && (
        <div className="mt-4">
          <label className="text-xs text-zinc-500">
            Rotation
          </label>

          <select
            value={rotation}
            onChange={(event) =>
              setRotation(
                Number(
                  event.target.value,
                ) as PDFPageRotation,
              )
            }
            className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 text-sm text-white outline-none"
          >
            <option value="90">
              90° clockwise
            </option>

            <option value="180">
              180°
            </option>

            <option value="270">
              270° clockwise
            </option>
          </select>
        </div>
      )}

      {tool !== 'pdf-to-images' && (
        <button
          type="button"
          disabled={
            !hasFiles ||
            isProcessing
          }
          onClick={run}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isProcessing ? (
            <>
              <Loader2
                size={17}
                className="animate-spin"
              />
              Processing...
            </>
          ) : tool === 'merge' ? (
            <>
              <FilePlus size={17} />
              Merge PDFs
            </>
          ) : tool === 'split' ? (
            <>
              <Scissors size={17} />
              Split PDF
            </>
          ) : tool === 'rotate' ? (
            <>
              <RotateCw size={17} />
              Rotate PDF
            </>
          ) : (
            <>
              <Download size={17} />
              Create PDF
            </>
          )}
        </button>
      )}

      {tool === 'pdf-to-images' && (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-zinc-500">
          PDF → Images will use the browser
          PDF renderer in the next implementation
          pass.
        </div>
      )}
    </section>
  );
}
