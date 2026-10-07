"use client";

import { useCallback, useEffect, useState } from "react";

import {
  fetchWeather,
  searchLocations,
} from "@/features/weather/lib/weather";

import type {
  WeatherData,
  WeatherLocation,
} from "@/features/weather/types";

import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

const WEATHER_LOCATION_STORAGE_KEY =
  STORAGE_KEYS.weatherLocation;

const DEFAULT_LOCATION: WeatherLocation = {
  name: "Chandigarh",
  country: "India",
  latitude: 30.7333,
  longitude: 76.7794,
  timezone: "Asia/Kolkata",
};

export function useWeather() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [locations, setLocations] = useState<
    WeatherLocation[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(
    async (location: WeatherLocation) => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWeather(location);

        setWeather(data);

        localStorageAdapter.set(
          WEATHER_LOCATION_STORAGE_KEY,
          location,
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load weather.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const stored =
      localStorageAdapter.get<unknown>(
        WEATHER_LOCATION_STORAGE_KEY,
      );

    if (stored && typeof stored === "object") {
      void loadWeather(
        stored as WeatherLocation,
      );
      return;
    }

    void loadWeather(DEFAULT_LOCATION);
  }, [loadWeather]);

  const search = async (query: string) => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      setLocations([]);
      return;
    }

    setSearching(true);
    setError(null);

    try {
      const results =
        await searchLocations(cleanQuery);

      setLocations(results);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to search locations.",
      );
    } finally {
      setSearching(false);
    }
  };

  const selectLocation = async (
    location: WeatherLocation,
  ) => {
    setLocations([]);

    await loadWeather(location);
  };

  return {
    weather,
    locations,
    loading,
    searching,
    error,
    search,
    selectLocation,
    reload: () => {
      if (weather?.location) {
        void loadWeather(
          weather.location,
        );
      }
    },
  };
}
