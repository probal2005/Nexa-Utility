'use client';

import { Check, Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

import type { BarcodeResult as BarcodeResultType } from '@/features/camera/barcode/types';

type Props = {
  result: BarcodeResultType | null;
};

function isUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    );
  } catch {
    return false;
  }
}

export function BarcodeResult({ result }: Props) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return null;
  }

  const url = isUrl(result.text);

  const copyResult = async () => {
    await navigator.clipboard.writeText(result.text);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-600">
            Barcode detected
          </p>

          <p className="mt-2 text-sm text-zinc-400">
            Format: {result.format}
          </p>
        </div>

        <button
          onClick={copyResult}
          className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.08] px-3 text-xs text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <div className="mt-4 break-all rounded-xl bg-black/30 p-4 text-sm leading-6 text-white">
        {result.text}
      </div>

      {url && (
        <a
          href={result.text}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <ExternalLink size={15} />
          Open Link
        </a>
      )}
    </div>
  );
}
