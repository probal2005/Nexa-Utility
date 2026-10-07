'use client';

import {
  Check,
  Copy,
  ExternalLink,
  QrCode,
} from 'lucide-react';

import { useState } from 'react';

import type { QRResult as QRResultType } from '@/features/camera/qr/types';

type Props = {
  result: QRResultType;
  isUrl: boolean;
  onScanAgain: () => void;
};

export function QRResult({
  result,
  isUrl,
  onScanAgain,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result.data);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
          <QrCode size={19} />
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            QR code detected
          </p>

          <p className="text-xs text-zinc-600">
            {isUrl ? 'Website / URL' : 'Text'}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
        <p className="break-all text-sm leading-6 text-zinc-300">
          {result.data}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={copyResult}
          className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          {copied ? (
            <>
              <Check size={15} />
              Copied
            </>
          ) : (
            <>
              <Copy size={15} />
              Copy
            </>
          )}
        </button>

        {isUrl && (
          <a
            href={result.data}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-medium text-black transition hover:bg-zinc-200"
          >
            <ExternalLink size={15} />
            Open
          </a>
        )}

        <button
          onClick={onScanAgain}
          className="flex h-10 items-center gap-2 rounded-xl border border-white/[0.08] px-4 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          Scan again
        </button>
      </div>
    </div>
  );
}
