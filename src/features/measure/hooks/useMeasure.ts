"use client";

import { useCallback, useState } from "react";

import {
  calculateAngle,
  calculatePixelDistance,
  pixelsToCentimeters,
} from "../lib/measure";

import type {
  MeasureMode,
  MeasurePoint,
  MeasureState,
} from "../types";

const INITIAL_STATE: MeasureState = {
  mode: "distance",
  status: "idle",
  distance: {
    start: null,
    end: null,
    pixels: 0,
    centimeters: null,
    meters: null,
  },
  angle: {
    first: null,
    vertex: null,
    third: null,
    degrees: null,
  },
  error: null,
};

export function useMeasure() {
  const [state, setState] =
    useState<MeasureState>(INITIAL_STATE);

  const setMode = useCallback(
    (mode: MeasureMode) => {
      setState((current) => ({
        ...current,
        mode,
        status: "ready",
        error: null,
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setState((current) => ({
      ...INITIAL_STATE,
      mode: current.mode,
    }));
  }, []);

  const setCalibration = useCallback(
    (pixelsPerCentimeter: number) => {
      setState((current) => {
        if (
          !current.distance.start ||
          !current.distance.end
        ) {
          return current;
        }

        const pixels =
          calculatePixelDistance(
            current.distance.start,
            current.distance.end,
          );

        const centimeters =
          pixelsToCentimeters(
            pixels,
            pixelsPerCentimeter,
          );

        return {
          ...current,
          distance: {
            ...current.distance,
            pixels,
            centimeters,
            meters: centimeters / 100,
          },
          status: "complete",
        };
      });
    },
    [],
  );

  const addPoint = useCallback(
    (point: MeasurePoint) => {
      setState((current) => {
        if (current.mode === "distance") {
          if (!current.distance.start) {
            return {
              ...current,
              status: "measuring",
              distance: {
                ...current.distance,
                start: point,
                end: null,
                pixels: 0,
                centimeters: null,
                meters: null,
              },
            };
          }

          const pixels =
            calculatePixelDistance(
              current.distance.start,
              point,
            );

          return {
            ...current,
            status: "complete",
            distance: {
              ...current.distance,
              end: point,
              pixels,
            },
          };
        }

        if (current.mode === "angle") {
          if (!current.angle.first) {
            return {
              ...current,
              status: "measuring",
              angle: {
                ...current.angle,
                first: point,
                vertex: null,
                third: null,
                degrees: null,
              },
            };
          }

          if (!current.angle.vertex) {
            return {
              ...current,
              status: "measuring",
              angle: {
                ...current.angle,
                vertex: point,
              },
            };
          }

          const degrees = calculateAngle(
            current.angle.first,
            current.angle.vertex,
            point,
          );

          return {
            ...current,
            status: "complete",
            angle: {
              ...current.angle,
              third: point,
              degrees,
            },
          };
        }

        return current;
      });
    },
    [],
  );

  return {
    ...state,
    setMode,
    addPoint,
    setCalibration,
    reset,
  };
}
