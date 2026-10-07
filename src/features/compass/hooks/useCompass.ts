'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  headingToDirection,
  normalizeHeading,
} from '../lib/compass';

export function useCompass() {
  const [heading, setHeading] =
    useState<number | null>(null);

  const [supported, setSupported] =
    useState(true);

  const [
    permissionRequired,
    setPermissionRequired,
  ] = useState(false);

  const [
    permissionGranted,
    setPermissionGranted,
  ] = useState(false);

  const [listening, setListening] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleOrientation = useCallback(
    (
      event: DeviceOrientationEvent,
    ) => {
      let nextHeading: number | null =
        null;

      const webkitEvent =
        event as DeviceOrientationEvent & {
          webkitCompassHeading?: number;
        };

      if (
        typeof webkitEvent.webkitCompassHeading ===
          'number' &&
        Number.isFinite(
          webkitEvent.webkitCompassHeading,
        )
      ) {
        nextHeading =
          webkitEvent.webkitCompassHeading;
      } else if (
        typeof event.alpha === 'number'
      ) {
        nextHeading =
          360 - event.alpha;
      }

      if (nextHeading === null) {
        return;
      }

      setHeading(
        normalizeHeading(nextHeading),
      );
    },
    [],
  );

  const start = useCallback(
    async () => {
      if (
        typeof window === 'undefined'
      ) {
        return;
      }

      if (
        !('DeviceOrientationEvent' in
          window)
      ) {
        setSupported(false);
        setError(
          'Device orientation is not supported by this browser.',
        );
        return;
      }

      setError(null);

      const OrientationEvent =
        DeviceOrientationEvent as typeof DeviceOrientationEvent & {
          requestPermission?: () => Promise<
            'granted' | 'denied'
          >;
        };

      if (
        typeof OrientationEvent.requestPermission ===
        'function'
      ) {
        setPermissionRequired(true);

        try {
          const permission =
            await OrientationEvent.requestPermission();

          if (permission !== 'granted') {
            setPermissionGranted(false);
            setError(
              'Motion and orientation permission was denied.',
            );
            return;
          }

          setPermissionGranted(true);
        } catch {
          setError(
            'Unable to request device orientation permission.',
          );
          return;
        }
      } else {
        setPermissionRequired(false);
        setPermissionGranted(true);
      }

      window.addEventListener(
        'deviceorientation',
        handleOrientation,
        true,
      );

      setListening(true);
    },
    [handleOrientation],
  );

  const stop = useCallback(() => {
    if (
      typeof window === 'undefined'
    ) {
      return;
    }

    window.removeEventListener(
      'deviceorientation',
      handleOrientation,
      true,
    );

    setListening(false);
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener(
        'deviceorientation',
        handleOrientation,
        true,
      );
    };
  }, [handleOrientation]);

  return {
    heading,
    direction:
      heading === null
        ? null
        : headingToDirection(heading),
    supported,
    permissionRequired,
    permissionGranted,
    listening,
    error,
    start,
    stop,
  };
}
