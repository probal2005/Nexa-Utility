'use client';

import dynamic from 'next/dynamic';

import {
  Compass,
  Map,
  MapPin,
} from 'lucide-react';

import { useMaps } from '../hooks/useMaps';

import {
  formatCoordinates,
} from '../lib/maps';

import { MapControls } from './MapControls';
import { MapSearch } from './MapSearch';

const MapView = dynamic(
  () =>
    import('./MapView').then(
      (module) => module.MapView,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="text-sm text-zinc-500">
          Loading map...
        </div>
      </div>
    ),
  },
);

export function MapsPage() {
  const maps = useMaps();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-zinc-500">
          <Map size={16} />

          <span className="text-sm">
            Nexa Utility
          </span>

          <span className="text-zinc-700">
            /
          </span>

          <span className="text-sm">
            Maps
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Maps
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Search places, explore the map,
              and quickly locate yourself.
            </p>
          </div>

          <MapControls
            loading={maps.loading}
            onLocate={maps.locateUser}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="relative min-h-[420px]">
          <MapView
            location={maps.location}
          />
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <MapSearch
              query={maps.query}
              results={maps.results}
              loading={maps.loading}
              error={maps.error}
              onQueryChange={
                maps.setQuery
              }
              onSearch={() =>
                maps.search()
              }
              onSelect={
                maps.selectPlace
              }
            />
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                <MapPin
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Selected location
                </p>

                <p className="text-xs text-zinc-500">
                  Map coordinates
                </p>
              </div>
            </div>

            {maps.location ? (
              <div className="mt-5">
                <p className="break-all font-mono text-sm text-zinc-300">
                  {formatCoordinates(
                    maps.location.latitude,
                    maps.location.longitude,
                  )}
                </p>

                <p className="mt-2 text-xs text-zinc-500">
                  {maps.location.name ??
                    'Selected point'}
                </p>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-zinc-500">
                Search for a place or use
                your current location to
                select a point on the map.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-3">
              <Compass
                size={18}
                className="text-zinc-400"
              />

              <p className="text-sm font-semibold text-white">
                Privacy
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-500">
              Your browser location is only
              requested when you press
              “My location”. Nexa Utility
              does not store your coordinates.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
