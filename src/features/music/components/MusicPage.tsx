'use client';

import {
  FolderOpen,
  Music2,
  Trash2,
} from 'lucide-react';

import {
  useRef,
} from 'react';

import {
  MusicPlayer,
} from './MusicPlayer';

import {
  Playlist,
} from './Playlist';

import {
  useMusic,
} from '../hooks/useMusic';

export function MusicPage() {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const music =
    useMusic();

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      void music.addFiles(
        event.target.files,
      );
    }

    event.target.value = '';
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
              <Music2 className="h-5 w-5 text-white" />
            </div>

            <span className="text-sm text-white/40">
              Media
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Music
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Play your local audio files directly
            in Nexa Utility. Nothing is uploaded.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              inputRef.current?.click()
            }
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <FolderOpen className="h-4 w-4" />
            Add Music
          </button>

          {music.tracks.length > 0 && (
            <button
              type="button"
              onClick={music.clearPlaylist}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      {music.error && (
        <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {music.error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <MusicPlayer
          track={music.currentTrack}
          isPlaying={music.isPlaying}
          currentTime={music.currentTime}
          duration={music.duration}
          volume={music.volume}
          shuffle={music.shuffle}
          repeat={music.repeat}
          onTogglePlay={() =>
            void music.togglePlay()
          }
          onPrevious={() =>
            void music.previous()
          }
          onNext={() =>
            void music.next()
          }
          onSeek={music.seek}
          onVolumeChange={
            music.changeVolume
          }
          onToggleShuffle={() =>
            music.setShuffle(
              (current) => !current,
            )
          }
          onCycleRepeat={
            music.cycleRepeat
          }
        />

        <Playlist
          tracks={music.tracks}
          currentIndex={
            music.currentIndex
          }
          onSelect={(index) =>
            void music.loadTrack(
              index,
              true,
            )
          }
          onRemove={
            music.removeTrack
          }
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
        <div className="flex items-start gap-3">
          <Music2 className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />

          <div>
            <p className="text-sm font-medium text-white/70">
              Private by default
            </p>

            <p className="mt-1 text-xs leading-5 text-white/35">
              Music files are processed locally by
              your browser. Nexa Utility does not
              upload your audio to a server.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
