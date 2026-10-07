'use client';

import {
  FileAudio,
  Trash2,
} from 'lucide-react';

import {
  formatFileSize,
  formatTime,
} from '../lib/music';

import type {
  MusicTrack,
} from '../types';

type PlaylistProps = {
  tracks: MusicTrack[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
};

export function Playlist({
  tracks,
  currentIndex,
  onSelect,
  onRemove,
}: PlaylistProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">
            Playlist
          </h2>

          <p className="text-xs text-white/40">
            {tracks.length}{' '}
            {tracks.length === 1
              ? 'track'
              : 'tracks'}
          </p>
        </div>
      </div>

      {tracks.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
          <FileAudio className="mb-3 h-8 w-8 text-white/20" />

          <p className="text-sm text-white/50">
            Your playlist is empty.
          </p>

          <p className="mt-1 text-xs text-white/30">
            Add local audio files to start.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tracks.map((track, index) => {
            const active =
              index === currentIndex;

            return (
              <div
                key={track.id}
                className={`flex items-center gap-3 rounded-2xl border p-3 transition ${
                  active
                    ? 'border-white/20 bg-white/[0.09]'
                    : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    onSelect(index)
                  }
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]">
                    <FileAudio className="h-4 w-4 text-white/60" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {track.name}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      {formatTime(
                        track.duration,
                      )}{' '}
                      ·{' '}
                      {formatFileSize(
                        track.size,
                      )}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onRemove(index)
                  }
                  className="rounded-xl p-2 text-white/30 transition hover:bg-white/10 hover:text-white"
                  aria-label={`Remove ${track.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
