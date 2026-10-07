"use client";

import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

import type { WeatherLocation } from "@/features/weather/types";

type Props = {
  locations: WeatherLocation[];
  searching: boolean;
  onSearch: (query: string) => void;
  onSelect: (location: WeatherLocation) => void;
};

export function WeatherSearch({
  locations,
  searching,
  onSearch,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      onSearch(query);
    }, 350);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [query, onSearch]);

  return (
    <div className="relative">
      <div className="relative">
        {searching ? (
          <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-white/25" />
        ) : (
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
        )}

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search city..."
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
        />
      </div>

      {locations.length > 0 && (
        <div className="absolute left-0 right-0 top-14 z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#111216] shadow-2xl">
          {locations.map((location) => (
            <button
              key={`${location.latitude}-${location.longitude}`}
              type="button"
              onClick={() => {
                onSelect(location);
                setQuery("");
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/[0.06]"
            >
              <MapPin className="h-4 w-4 shrink-0 text-white/25" />

              <div className="min-w-0">
                <p className="truncate text-sm text-white">
                  {location.name}
                </p>

                <p className="truncate text-xs text-white/30">
                  {[location.admin1, location.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
