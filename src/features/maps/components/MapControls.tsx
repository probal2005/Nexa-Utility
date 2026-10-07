'use client';

import {
  Loader2,
  LocateFixed,
} from 'lucide-react';

type MapControlsProps = {
  loading: boolean;
  onLocate: () => void;
};

export function MapControls({
  loading,
  onLocate,
}: MapControlsProps) {
  return (
    <button
      type="button"
      onClick={onLocate}
      disabled={loading}
      className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <Loader2
          size={17}
          className="animate-spin"
        />
      ) : (
        <LocateFixed size={17} />
      )}

      {loading
        ? 'Locating...'
        : 'My location'}
    </button>
  );
}
