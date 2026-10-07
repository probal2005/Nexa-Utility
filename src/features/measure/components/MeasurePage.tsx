"use client";

import {
  Activity,
  Crosshair,
  Move,
  RotateCcw,
  Ruler,
} from "lucide-react";

import { MeasureCanvas } from "./MeasureCanvas";

import { useMeasure } from "../hooks/useMeasure";
import {
  formatAngle,
  formatDistance,
} from "../lib/measure";

export function MeasurePage() {
  const {
    mode,
    status,
    distance,
    angle,
    setMode,
    addPoint,
    reset,
  } = useMeasure();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-transparent p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-cyan-400">
            <Ruler className="h-4 w-4" />
            Measure
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Measure objects and angles
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Use point-to-point measurement and angle tools directly in your
            browser.
          </p>
        </div>
      </section>

      <section className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("distance")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            mode === "distance"
              ? "bg-white text-black"
              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <Move className="h-4 w-4" />
          Distance
        </button>

        <button
          type="button"
          onClick={() => setMode("angle")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            mode === "angle"
              ? "bg-white text-black"
              : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          <Activity className="h-4 w-4" />
          Angle
        </button>

        <button
          type="button"
          onClick={reset}
          className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[0.06] hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </section>

      <section>
        <MeasureCanvas
          mode={mode}
          start={distance.start}
          end={distance.end}
          first={angle.first}
          vertex={angle.vertex}
          third={angle.third}
          onPoint={addPoint}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
              <Crosshair className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Distance
              </h2>
              <p className="text-sm text-zinc-500">
                Pixel-based measurement
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-white">
            {distance.pixels > 0
              ? `${distance.pixels.toFixed(1)} px`
              : "—"}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {formatDistance(distance.centimeters)}
          </p>

          <p className="mt-4 text-xs leading-5 text-zinc-600">
            Physical units require calibration against an object of known
            size.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
              <Activity className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Angle
              </h2>
              <p className="text-sm text-zinc-500">
                Three-point angle measurement
              </p>
            </div>
          </div>

          <p className="mt-5 text-3xl font-bold text-white">
            {formatAngle(angle.degrees)}
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {status === "complete"
              ? "Measurement complete"
              : "Select three points"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-5">
        <h2 className="font-semibold text-white">
          Measurement accuracy
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          Browser-based screen measurements are relative measurements.
          Accurate real-world distance requires camera calibration or an AR
          measurement system. This foundation is designed so calibrated and
          AR-based measurement can be added later.
        </p>
      </section>
    </div>
  );
}
