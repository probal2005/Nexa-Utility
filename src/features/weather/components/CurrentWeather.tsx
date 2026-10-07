"use client";

import {
  Droplets,
  Eye,
  Gauge,
  Wind,
} from "lucide-react";

import {
  getWeatherDescription,
  getWeatherIcon,
} from "@/features/weather/lib/weather";

import type { WeatherData } from "@/features/weather/types";

type Props = {
  weather: WeatherData;
};

export function CurrentWeather({ weather }: Props) {
  const { current, location } = weather;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-7">
      <div className="flex flex-col justify-between gap-8 sm:flex-row">
        <div>
          <div className="flex items-center gap-2 text-white/35">
            <span className="text-sm">
              {location.name}
            </span>

            {location.admin1 && (
              <>
                <span>·</span>
                <span className="text-xs">
                  {location.admin1}
                </span>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center gap-5">
            <span className="text-6xl">
              {getWeatherIcon(current.weatherCode)}
            </span>

            <div>
              <div className="flex items-start">
                <span className="text-6xl font-semibold tracking-tight text-white">
                  {Math.round(current.temperature)}
                </span>

                <span className="mt-2 text-2xl text-white/40">
                  °C
                </span>
              </div>

              <p className="mt-1 text-sm text-white/40">
                {getWeatherDescription(
                  current.weatherCode,
                )}
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs text-white/25">
            Feels like{" "}
            {Math.round(current.apparentTemperature)}°C
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:w-72">
          <Metric
            icon={<Droplets className="h-4 w-4" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />

          <Metric
            icon={<Wind className="h-4 w-4" />}
            label="Wind"
            value={`${Math.round(current.windSpeed)} km/h`}
          />

          <Metric
            icon={<Gauge className="h-4 w-4" />}
            label="Rain"
            value={`${current.precipitation} mm`}
          />

          <Metric
            icon={<Eye className="h-4 w-4" />}
            label="Period"
            value={current.isDay ? "Day" : "Night"}
          />
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/15 p-4">
      <div className="flex items-center gap-2 text-white/25">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>
      </div>

      <p className="mt-3 text-sm font-medium text-white/70">
        {value}
      </p>
    </div>
  );
}
