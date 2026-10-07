"use client";

import {
  CalendarDays,
  CloudRain,
  Sunrise,
  Sunset,
} from "lucide-react";

import {
  formatForecastDay,
  formatHour,
  getWeatherDescription,
  getWeatherIcon,
} from "@/features/weather/lib/weather";

import type { WeatherData } from "@/features/weather/types";

type Props = {
  weather: WeatherData;
};

export function Forecast({ weather }: Props) {
  const hourlyStart = new Date().getHours();

  const hourlyIndexes = Array.from(
    { length: 12 },
    (_, index) => hourlyStart + index,
  ).filter(
    (index) => index < weather.hourly.time.length,
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/35" />

          <h2 className="text-sm font-semibold text-white">
            Hourly forecast
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {hourlyIndexes.map((index) => (
            <div
              key={weather.hourly.time[index]}
              className="min-w-[82px] rounded-2xl border border-white/[0.06] bg-black/15 p-3 text-center"
            >
              <p className="text-[10px] text-white/30">
                {formatHour(weather.hourly.time[index])}
              </p>

              <div className="my-3 text-xl">
                {getWeatherIcon(
                  weather.hourly.weatherCode[index],
                )}
              </div>

              <p className="text-sm font-medium text-white">
                {Math.round(
                  weather.hourly.temperature[index],
                )}
                °
              </p>

              <p className="mt-1 flex items-center justify-center gap-1 text-[9px] text-white/25">
                <CloudRain className="h-2.5 w-2.5" />
                {weather.hourly.precipitationProbability[
                  index
                ] ?? 0}
                %
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-white/35" />

          <h2 className="text-sm font-semibold text-white">
            7-day forecast
          </h2>
        </div>

        <div className="space-y-1">
          {weather.daily.time.map((date, index) => (
            <div
              key={date}
              className="grid grid-cols-[70px_1fr_auto_auto] items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[0.04] sm:grid-cols-[90px_1fr_auto_auto_auto]"
            >
              <span className="text-xs font-medium text-white/50">
                {index === 0
                  ? "Today"
                  : formatForecastDay(date)}
              </span>

              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {getWeatherIcon(
                    weather.daily.weatherCode[index],
                  )}
                </span>

                <span className="hidden text-xs text-white/25 sm:block">
                  {getWeatherDescription(
                    weather.daily.weatherCode[index],
                  )}
                </span>
              </div>

              <span className="text-xs text-white/25">
                <CloudRain className="mr-1 inline h-3 w-3" />
                {weather.daily.precipitationProbability[
                  index
                ] ?? 0}
                %
              </span>

              <span className="text-sm font-medium text-white">
                {Math.round(
                  weather.daily.temperatureMax[index],
                )}
                °
              </span>

              <span className="text-sm text-white/25">
                {Math.round(
                  weather.daily.temperatureMin[index],
                )}
                °
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <SunCard
          icon={<Sunrise className="h-4 w-4" />}
          label="Sunrise"
          value={weather.daily.sunrise[0]}
        />

        <SunCard
          icon={<Sunset className="h-4 w-4" />}
          label="Sunset"
          value={weather.daily.sunset[0]}
        />
      </section>
    </div>
  );
}

function SunCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="flex items-center gap-2 text-white/30">
        {icon}
        <span className="text-xs">{label}</span>
      </div>

      <p className="mt-3 text-sm font-medium text-white/70">
        {new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(value))}
      </p>
    </div>
  );
}
