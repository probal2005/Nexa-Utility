"use client";

import {
  useEffect,
  useRef,
} from "react";

import type {
  MeasureMode,
  MeasurePoint,
} from "../types";

type Props = {
  mode: MeasureMode;
  start: MeasurePoint | null;
  end: MeasurePoint | null;
  first: MeasurePoint | null;
  vertex: MeasurePoint | null;
  third: MeasurePoint | null;
  onPoint: (point: MeasurePoint) => void;
};

export function MeasureCanvas({
  mode,
  start,
  end,
  first,
  vertex,
  third,
  onPoint,
}: Props) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const parent =
      canvas.parentElement;

    if (!parent) {
      return;
    }

    const width = parent.clientWidth;
    const height = Math.max(
      360,
      Math.min(520, width * 0.65),
    );

    const ratio =
      window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context =
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.scale(ratio, ratio);

    context.clearRect(
      0,
      0,
      width,
      height,
    );

    context.fillStyle = "#09090b";
    context.fillRect(
      0,
      0,
      width,
      height,
    );

    context.strokeStyle =
      "rgba(255,255,255,0.04)";
    context.lineWidth = 1;

    const gridSize = 32;

    for (
      let x = 0;
      x < width;
      x += gridSize
    ) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (
      let y = 0;
      y < height;
      y += gridSize
    ) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const drawPoint = (
      point: MeasurePoint | null,
      label: string,
    ) => {
      if (!point) {
        return;
      }

      context.beginPath();
      context.arc(
        point.x,
        point.y,
        7,
        0,
        Math.PI * 2,
      );

      context.fillStyle =
        "rgba(255,255,255,0.95)";

      context.fill();

      context.beginPath();
      context.arc(
        point.x,
        point.y,
        13,
        0,
        Math.PI * 2,
      );

      context.strokeStyle =
        "rgba(34,211,238,0.5)";

      context.lineWidth = 2;
      context.stroke();

      context.fillStyle =
        "rgba(255,255,255,0.9)";

      context.font =
        "12px sans-serif";

      context.fillText(
        label,
        point.x + 16,
        point.y - 10,
      );
    };

    if (
      mode === "distance" &&
      start &&
      end
    ) {
      context.beginPath();
      context.moveTo(
        start.x,
        start.y,
      );
      context.lineTo(
        end.x,
        end.y,
      );

      context.strokeStyle =
        "rgba(34,211,238,0.9)";

      context.lineWidth = 3;
      context.stroke();
    }

    if (
      mode === "angle" &&
      first &&
      vertex
    ) {
      context.beginPath();
      context.moveTo(
        first.x,
        first.y,
      );
      context.lineTo(
        vertex.x,
        vertex.y,
      );

      if (third) {
        context.lineTo(
          third.x,
          third.y,
        );
      }

      context.strokeStyle =
        "rgba(34,211,238,0.9)";

      context.lineWidth = 3;
      context.stroke();
    }

    drawPoint(start, "A");
    drawPoint(end, "B");
    drawPoint(first, "A");
    drawPoint(vertex, "V");
    drawPoint(third, "B");

    context.fillStyle =
      "rgba(255,255,255,0.45)";

    context.font =
      "13px sans-serif";

    if (mode === "distance") {
      context.fillText(
        start
          ? end
            ? "Measurement complete"
            : "Tap the second point"
          : "Tap the first point",
        16,
        height - 18,
      );
    } else {
      context.fillText(
        first
          ? vertex
            ? third
              ? "Angle complete"
              : "Tap the third point"
            : "Tap the vertex"
          : "Tap the first point",
        16,
        height - 18,
      );
    }
  }, [
    mode,
    start,
    end,
    first,
    vertex,
    third,
  ]);

  const handleClick = (
    event: React.MouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect =
      canvas.getBoundingClientRect();

    onPoint({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      timestamp: Date.now(),
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="w-full cursor-crosshair rounded-2xl border border-white/10"
    />
  );
}
