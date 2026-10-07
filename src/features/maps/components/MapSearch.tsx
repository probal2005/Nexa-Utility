'use client';

import {
  Loader2,
  MapPin,
  Search,
} from 'lucide-react';

import type {
  PlaceResult,
} from '../types';

type MapSearchProps = {
  query: string;
  results: PlaceResult[];
  loading: boolean;
  error: string | null;
  onQueryChange: (
    value: string,
  ) => void;
  onSearch: () => void;
  onSelect: (
    place: PlaceResult,
  ) => void;
};

export function MapSearch({
  query,
  results,
  loading,
  error,
  onQueryChange,
  onSearch,
  onSelect,
}: MapSearchProps) {
  return (
    <div className="relative">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSearch();
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={query}
            onChange={(event) =>
              onQueryChange(
                event.target.value,
              )
            }
            placeholder="Search places..."
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/25"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 items-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <Search size={17} />
          )}

          Search
        </button>
      </form>

      {error && (
        <p className="mt-3 text-sm text-red-400">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="absolute left-0 right-0 top-14 z-[1000] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
          {results.map(
            (place) => (
              <button
                key={place.id}
                type="button"
                onClick={() =>
                  onSelect(place)
                }
                className="flex w-full items-start gap-3 border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 hover:bg-white/[0.06]"
              >
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-zinc-400"
                />

                <span className="min-w-0">
                  <span className="block text-sm font-medium text-white">
                    {place.name}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-zinc-500">
                    {place.displayName}
                  </span>
                </span>
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
