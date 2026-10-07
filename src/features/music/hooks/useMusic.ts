'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  MusicTrack,
  RepeatMode,
} from '../types';

import {
  getNextRepeatMode,
} from '../lib/music';

export function useMusic() {
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const objectUrlsRef =
    useRef<string[]>([]);

  const [tracks, setTracks] =
    useState<MusicTrack[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState<number>(-1);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [currentTime, setCurrentTime] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [volume, setVolume] =
    useState(0.8);

  const [shuffle, setShuffle] =
    useState(false);

  const [repeat, setRepeat] =
    useState<RepeatMode>('off');

  const [error, setError] =
    useState<string | null>(null);

  const currentTrack =
    currentIndex >= 0
      ? tracks[currentIndex] ?? null
      : null;

  const createTrack = useCallback(
    (file: File): Promise<MusicTrack> => {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);

        const audio = new Audio();

        audio.preload = 'metadata';

        audio.onloadedmetadata = () => {
          resolve({
            id: crypto.randomUUID(),
            name: file.name,
            fileName: file.name,
            url,
            size: file.size,
            type: file.type,
            duration: Number.isFinite(audio.duration)
              ? audio.duration
              : 0,
            createdAt: Date.now(),
          });
        };

        audio.onerror = () => {
          URL.revokeObjectURL(url);

          reject(
            new Error(
              `Unable to read "${file.name}".`,
            ),
          );
        };

        audio.src = url;
      });
    },
    [],
  );

  const addFiles = useCallback(
    async (files: FileList | File[]) => {
      const audioFiles = Array.from(files).filter(
        (file) =>
          file.type.startsWith('audio/') ||
          /\.(mp3|wav|ogg|m4a|aac|flac|webm)$/i.test(
            file.name,
          ),
      );

      if (audioFiles.length === 0) {
        setError(
          'Please select a supported audio file.',
        );

        return;
      }

      setError(null);

      try {
        const newTracks: MusicTrack[] = [];

        for (const file of audioFiles) {
          const track = await createTrack(file);

          newTracks.push(track);

          objectUrlsRef.current.push(track.url);
        }

        setTracks((previous) => {
          const updated = [
            ...previous,
            ...newTracks,
          ];

          if (currentIndex === -1) {
            setCurrentIndex(0);
          }

          return updated;
        });

        setCurrentIndex((previous) => {
          if (previous >= 0) {
            return previous;
          }

          return 0;
        });
      } catch (trackError) {
        setError(
          trackError instanceof Error
            ? trackError.message
            : 'Unable to add audio files.',
        );
      }
    },
    [createTrack, currentIndex],
  );

  const loadTrack = useCallback(
    async (index: number, autoPlay = true) => {
      const track = tracks[index];

      if (!track || !audioRef.current) {
        return;
      }

      setCurrentIndex(index);
      setCurrentTime(0);
      setDuration(track.duration);
      setError(null);

      audioRef.current.src = track.url;
      audioRef.current.volume = volume;

      if (autoPlay) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }
      }
    },
    [tracks, volume],
  );

  const play = useCallback(async () => {
    if (!audioRef.current) {
      return;
    }

    if (!currentTrack && tracks.length > 0) {
      await loadTrack(0, true);
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setError(
        'Unable to play this track.',
      );
    }
  }, [currentTrack, loadTrack, tracks.length]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  }, [isPlaying, pause, play]);

  const getNextIndex = useCallback(
    (fromIndex: number) => {
      if (tracks.length === 0) {
        return -1;
      }

      if (shuffle && tracks.length > 1) {
        const availableIndexes = tracks
          .map((_, index) => index)
          .filter((index) => index !== fromIndex);

        const randomIndex =
          Math.floor(
            Math.random() *
              availableIndexes.length,
          );

        return availableIndexes[randomIndex];
      }

      if (fromIndex < tracks.length - 1) {
        return fromIndex + 1;
      }

      if (repeat === 'all') {
        return 0;
      }

      return -1;
    },
    [repeat, shuffle, tracks],
  );

  const next = useCallback(
    async (autoPlay = true) => {
      const nextIndex =
        getNextIndex(currentIndex);

      if (nextIndex === -1) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }

      await loadTrack(
        nextIndex,
        autoPlay,
      );
    },
    [currentIndex, getNextIndex, loadTrack],
  );

  const previous = useCallback(
    async () => {
      if (!audioRef.current) {
        return;
      }

      if (currentTime > 3) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        return;
      }

      const previousIndex =
        currentIndex > 0
          ? currentIndex - 1
          : repeat === 'all'
            ? tracks.length - 1
            : 0;

      await loadTrack(
        previousIndex,
        true,
      );
    },
    [
      currentIndex,
      currentTime,
      loadTrack,
      repeat,
      tracks.length,
    ],
  );

  const seek = useCallback(
    (time: number) => {
      if (!audioRef.current) {
        return;
      }

      audioRef.current.currentTime =
        Math.max(
          0,
          Math.min(
            time,
            duration || 0,
          ),
        );

      setCurrentTime(
        audioRef.current.currentTime,
      );
    },
    [duration],
  );

  const changeVolume = useCallback(
    (value: number) => {
      const nextVolume =
        Math.max(
          0,
          Math.min(1, value),
        );

      setVolume(nextVolume);

      if (audioRef.current) {
        audioRef.current.volume =
          nextVolume;
      }
    },
    [],
  );

  const removeTrack = useCallback(
    (index: number) => {
      const track = tracks[index];

      if (!track) {
        return;
      }

      if (currentIndex === index) {
        audioRef.current?.pause();

        if (audioRef.current) {
          audioRef.current.src = '';
        }

        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }

      URL.revokeObjectURL(track.url);

      setTracks((previous) =>
        previous.filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
      );

      setCurrentIndex((previous) => {
        if (previous === -1) {
          return -1;
        }

        if (index < previous) {
          return previous - 1;
        }

        if (index === previous) {
          return Math.min(
            previous,
            Math.max(
              0,
              tracks.length - 2,
            ),
          );
        }

        return previous;
      });
    },
    [currentIndex, tracks],
  );

  const clearPlaylist = useCallback(() => {
    audioRef.current?.pause();

    if (audioRef.current) {
      audioRef.current.src = '';
    }

    tracks.forEach((track) => {
      URL.revokeObjectURL(track.url);
    });

    setTracks([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [tracks]);

  const cycleRepeat = useCallback(() => {
    setRepeat((current) =>
      getNextRepeatMode(current),
    );
  }, []);

  useEffect(() => {
    const audio =
      new Audio();

    audio.preload = 'metadata';
    audio.volume = volume;

    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0,
      );
    };

    const handleEnded = async () => {
      if (repeat === 'one') {
        audio.currentTime = 0;

        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          setIsPlaying(false);
        }

        return;
      }

      const nextIndex =
        getNextIndex(currentIndex);

      if (nextIndex === -1) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }

      await loadTrack(
        nextIndex,
        true,
      );
    };

    audio.addEventListener(
      'timeupdate',
      handleTimeUpdate,
    );

    audio.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata,
    );

    audio.addEventListener(
      'ended',
      handleEnded,
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        'timeupdate',
        handleTimeUpdate,
      );

      audio.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        'ended',
        handleEnded,
      );

      audioRef.current = null;

      objectUrlsRef.current.forEach(
        (url) => URL.revokeObjectURL(url),
      );

      objectUrlsRef.current = [];
    };
  }, [
    currentIndex,
    getNextIndex,
    loadTrack,
    repeat,
    volume,
  ]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume =
        volume;
    }
  }, [volume]);

  return {
    tracks,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    error,
    addFiles,
    loadTrack,
    togglePlay,
    previous,
    next,
    seek,
    changeVolume,
    removeTrack,
    clearPlaylist,
    setShuffle,
    cycleRepeat,
  };
}
