'use client';

import {
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';

import {
  formatTime,
} from '../lib/music';

import type {
  MusicTrack,
  RepeatMode,
} from '../types';

type MusicPlayerProps = {
  track: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
};

export function MusicPlayer({
  track,
  isPlaying,
  currentTime,
  duration,
  volume,
  shuffle,
  repeat,
  onTogglePlay,
  onPrevious,
  onNext,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onCycleRepeat,
}: MusicPlayerProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
        <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl">
          <ListMusic className="h-12 w-12 text-white/60" />
        </div>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
          Now Playing
        </p>

        <h2 className="mt-2 max-w-full truncate text-xl font-semibold text-white">
          {track?.name ?? 'No track selected'}
        </h2>

        <p className="mt-1 text-sm text-white/40">
          {track
            ? 'Local audio'
            : 'Add music to begin'}
        </p>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={Math.min(
            currentTime,
            duration || 0,
          )}
          onChange={(event) =>
            onSeek(
              Number(event.target.value),
            )
          }
          disabled={!track}
          className="w-full accent-white disabled:opacity-30"
          aria-label="Track progress"
        />

        <div className="mt-1 flex justify-between text-xs text-white/40">
          <span>
            {formatTime(currentTime)}
          </span>

          <span>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={onToggleShuffle}
          className={`rounded-full p-2 transition ${
            shuffle
              ? 'bg-white text-black'
              : 'text-white/50 hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Toggle shuffle"
        >
          <Shuffle className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onPrevious}
          disabled={!track}
          className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          aria-label="Previous track"
        >
          <SkipBack className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onTogglePlay}
          disabled={!track}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition hover:scale-105 disabled:opacity-30"
          aria-label={
            isPlaying
              ? 'Pause'
              : 'Play'
          }
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="ml-1 h-6 w-6 fill-current" />
          )}
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!track}
          className="rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
          aria-label="Next track"
        >
          <SkipForward className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={onCycleRepeat}
          className={`rounded-full p-2 transition ${
            repeat !== 'off'
              ? 'bg-white text-black'
              : 'text-white/50 hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Change repeat mode"
          title={`Repeat: ${repeat}`}
        >
          {repeat === 'one' ? (
            <Repeat1 className="h-4 w-4" />
          ) : (
            <Repeat className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Volume2 className="h-4 w-4 shrink-0 text-white/50" />

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) =>
            onVolumeChange(
              Number(event.target.value),
            )
          }
          className="w-full accent-white"
          aria-label="Volume"
        />
      </div>
    </section>
  );
}
