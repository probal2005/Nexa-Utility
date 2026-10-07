"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { isNexaPermissionEnabled } from "@/features/privacy/lib/access";

import {
  createRecordingId,
  getDefaultRecordingName,
  getRecordingMimeType,
} from "../lib/recorder";

import type { RecorderState } from "../types";

export function useVoiceRecorder(
  onRecordingComplete: (
    blob: Blob,
    duration: number,
  ) => Promise<void>,
) {
  const [state, setState] = useState<RecorderState>({
    status: "idle",
    duration: 0,
    error: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateDuration = useCallback(() => {
    if (startedAtRef.current === null) {
      return;
    }

    const elapsed =
      elapsedBeforePauseRef.current +
      (Date.now() - startedAtRef.current);

    setState((current) => ({
      ...current,
      duration: elapsed,
    }));
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();

    timerRef.current = window.setInterval(
      updateDuration,
      250,
    );
  }, [stopTimer, updateDuration]);

  const start = useCallback(async () => {
    try {
      setState((current) => ({
        ...current,
        status: "requesting",
        error: null,
      }));

      if (!isNexaPermissionEnabled("microphone")) {
        throw new Error(
          "Microphone access is disabled in Nexa Utility Privacy Center.",
        );
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Microphone access is not supported by this browser.",
        );
      }

      if (typeof MediaRecorder === "undefined") {
        throw new Error(
          "Audio recording is not supported by this browser.",
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      streamRef.current = stream;

      const mimeType = getRecordingMimeType();

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      elapsedBeforePauseRef.current = 0;
      startedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        stopTimer();
        stopStream();

        setState((current) => ({
          ...current,
          status: "error",
          error: "An error occurred while recording.",
        }));
      };

      recorder.onstop = async () => {
        stopTimer();

        const finalDuration =
          state.duration > 0
            ? state.duration
            : startedAtRef.current
              ? Date.now() - startedAtRef.current
              : 0;

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        stopStream();

        if (blob.size > 0) {
          await onRecordingComplete(
            blob,
            finalDuration,
          );
        }

        chunksRef.current = [];
        startedAtRef.current = null;
        elapsedBeforePauseRef.current = 0;

        setState({
          status: "stopped",
          duration: finalDuration,
          error: null,
        });
      };

      recorder.start(250);

      setState({
        status: "recording",
        duration: 0,
        error: null,
      });

      startTimer();
    } catch (error) {
      stopStream();
      stopTimer();

      setState({
        status: "error",
        duration: 0,
        error:
          error instanceof Error
            ? error.message
            : "Unable to access the microphone.",
      });
    }
  }, [
    onRecordingComplete,
    startTimer,
    state.duration,
    stopStream,
    stopTimer,
  ]);

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "recording") {
      return;
    }

    updateDuration();

    if (startedAtRef.current !== null) {
      elapsedBeforePauseRef.current +=
        Date.now() - startedAtRef.current;
    }

    startedAtRef.current = null;

    recorder.pause();

    stopTimer();

    setState((current) => ({
      ...current,
      status: "paused",
    }));
  }, [stopTimer, updateDuration]);

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state !== "paused") {
      return;
    }

    startedAtRef.current = Date.now();

    recorder.resume();

    setState((current) => ({
      ...current,
      status: "recording",
    }));

    startTimer();
  }, [startTimer]);

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    updateDuration();

    if (recorder.state !== "inactive") {
      recorder.stop();
    }
  }, [updateDuration]);

  const reset = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }

    stopStream();
    stopTimer();

    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startedAtRef.current = null;
    elapsedBeforePauseRef.current = 0;

    setState({
      status: "idle",
      duration: 0,
      error: null,
    });
  }, [stopStream, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      stopStream();

      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [stopStream, stopTimer]);

  return {
    ...state,
    start,
    pause,
    resume,
    stop,
    reset,
    createRecordingId,
    getDefaultRecordingName,
  };
}
