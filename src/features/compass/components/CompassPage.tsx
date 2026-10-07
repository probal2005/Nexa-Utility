'use client';

import {
  Compass as CompassIcon,
  Info,
  ShieldCheck,
} from 'lucide-react';

import {
  CompassControls,
} from './CompassControls';

import {
  CompassDial,
} from './CompassDial';

import {
  useCompass,
} from '../hooks/useCompass';

export function CompassPage() {
  const compass = useCompass();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-400">
              <CompassIcon size={20} />
              <span className="text-sm font-medium">
                Device utility
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white">
              Compass
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              Use your device orientation sensor
              to determine your current heading.
            </p>
          </div>

          <CompassControls
            listening={compass.listening}
            onStart={compass.start}
            onStop={compass.stop}
          />
        </div>
      </section>

      {!compass.supported && (
        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/[0.05] p-5 text-sm text-amber-200">
          This browser does not expose the
          device orientation sensor. Try
          Nexa Utility on a supported mobile
          browser.
        </section>
      )}

      {compass.error && (
        <section className="rounded-3xl border border-red-400/20 bg-red-400/[0.05] p-5 text-sm text-red-200">
          {compass.error}
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-8">
          <CompassDial
            heading={compass.heading}
            direction={compass.direction}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-3 flex items-center gap-2 text-white">
              <Info size={18} />
              <h2 className="font-semibold">
                How it works
              </h2>
            </div>

            <p className="text-sm leading-6 text-zinc-400">
              Nexa Utility reads the browser&apos;s
              device-orientation sensor. On some
              mobile browsers, permission must be
              granted before the sensor can be used.
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-400/10 bg-emerald-400/[0.04] p-5">
            <div className="mb-3 flex items-center gap-2 text-emerald-300">
              <ShieldCheck size={18} />
              <h2 className="font-semibold">
                Privacy
              </h2>
            </div>

            <p className="text-sm leading-6 text-zinc-400">
              Orientation data is processed locally
              in your browser and is not uploaded
              by Nexa Utility.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-500">
              Sensor status
            </div>

            <div className="mt-2 text-sm font-medium text-white">
              {compass.listening
                ? 'Active'
                : 'Inactive'}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
