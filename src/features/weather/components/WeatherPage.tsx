"use client";

import { AlertCircle, CloudSun, Loader2, RefreshCw } from "lucide-react";

import { CurrentWeather } from "@/features/weather/components/CurrentWeather";
import { Forecast } from "@/features/weather/components/Forecast";
import { WeatherSearch } from "@/features/weather/components/WeatherSearch";
import { useWeather } from "@/features/weather/hooks/useWeather";

export function WeatherPage() {
  const {
    weather,
    locations,
    loading,
    searching,
    error,
    search,
    selectLocation,
    reload,
  } = useWeather();

  return (
    <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-black">
              <CloudSun className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/30">
                Nexa Utility
              </p>

              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Weather
              </h1>
            </div>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
            Live weather conditions, hourly forecasts, and the
            upcoming seven-day outlook.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:max-w-md">
          <div className="min-w-0 flex-1">
            <WeatherSearch
              locations={locations}
              searching={searching}
              onSearch={search}
              onSelect={selectLocation}
            />
          </div>

          <button
            type="button"
            onClick={reload}
            disabled={loading}
            aria-label="Refresh weather"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/35 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              className={[
                "h-4 w-4",
                loading ? "animate-spin" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/50">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {loading && !weather ? (
        <div className="flex min-h-[500px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.025]">
          <div className="text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-white/30" />

            <p className="mt-4 text-sm text-white/30">
              Loading weather...
            </p>
          </div>
        </div>
      ) : weather ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <CurrentWeather weather={weather} />

          <div className="xl:row-span-2">
            <Forecast weather={weather} />
          </div>
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-white/10 text-sm text-white/30">
          Search for a location to see its weather.
        </div>
      )}
    </div>
  );
}
