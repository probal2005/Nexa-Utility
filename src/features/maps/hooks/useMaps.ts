'use client';

import {
  useCallback,
  useState,
} from 'react';

import { isNexaPermissionEnabled } from '@/features/privacy/lib/access';

import {
  searchPlaces,
} from '../lib/maps';

import type {
  MapLocation,
  PlaceResult,
} from '../types';

export function useMaps() {
  const [
    location,
    setLocation,
  ] = useState<MapLocation | null>(
    null,
  );

  const [
    selectedPlace,
    setSelectedPlace,
  ] = useState<PlaceResult | null>(
    null,
  );

  const [
    results,
    setResults,
  ] = useState<PlaceResult[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    query,
    setQuery,
  ] = useState('');

  const search = useCallback(
    async (
      searchQuery?: string,
    ) => {
      const value =
        searchQuery ?? query;

      if (!value.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const places =
          await searchPlaces(value);

        setResults(places);

        if (places.length === 0) {
          setError(
            'No places found.',
          );
        }
      } catch (searchError) {
        console.error(
          'Map search error:',
          searchError,
        );

        setError(
          searchError instanceof Error
            ? searchError.message
            : 'Unable to search for places.',
        );

        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  const locateUser =
    useCallback(() => {
      if (
        typeof window ===
        'undefined'
      ) {
        return;
      }

      if (!isNexaPermissionEnabled('location')) {
        setError(
          'Location access is disabled in Nexa Utility Privacy Center.',
        );

        return;
      }

      if (
        !navigator.geolocation
      ) {
        setError(
          'Geolocation is not supported by this browser.',
        );

        return;
      }

      setLoading(true);
      setError(null);
      setSelectedPlace(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const {
            latitude,
            longitude,
            accuracy,
          } = position.coords;

          console.log(
            'Current location:',
            {
              latitude,
              longitude,
              accuracy,
            },
          );

          setLocation({
            latitude,
            longitude,
            name: 'My location',
          });

          setLoading(false);
        },
        (geolocationError) => {
          console.error(
            'Geolocation error:',
            geolocationError,
          );

          let message =
            'Unable to determine your location.';

          switch (
            geolocationError.code
          ) {
            case geolocationError.PERMISSION_DENIED:
              message =
                'Location permission was denied. Allow location access for localhost and try again.';
              break;

            case geolocationError.POSITION_UNAVAILABLE:
              message =
                'Your location is currently unavailable. Check your device location services and try again.';
              break;

            case geolocationError.TIMEOUT:
              message =
                'Location request timed out. Please try again.';
              break;
          }

          setError(message);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    }, []);

  const selectPlace =
    useCallback(
      (place: PlaceResult) => {
        setSelectedPlace(place);

        setLocation({
          latitude:
            place.latitude,
          longitude:
            place.longitude,
          name: place.name,
        });
      },
      [],
    );

  return {
    location,
    selectedPlace,
    results,
    loading,
    error,
    query,
    setQuery,
    search,
    locateUser,
    selectPlace,
  };
}
