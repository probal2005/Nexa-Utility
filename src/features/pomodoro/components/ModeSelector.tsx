'use client';

import type {
  PomodoroMode,
} from '../types';

type ModeSelectorProps = {
  mode: PomodoroMode;
  onChange: (
    mode: PomodoroMode,
  ) => void;
};

const modes: {
  value: PomodoroMode;
  label: string;
}[] = [
  {
    value: 'focus',
    label: 'Focus',
  },
  {
    value: 'short-break',
    label: 'Short Break',
  },
  {
    value: 'long-break',
    label: 'Long Break',
  },
];

export function ModeSelector({
  mode,
  onChange,
}: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {modes.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() =>
            onChange(item.value)
          }
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            mode === item.value
              ? 'bg-white text-black'
              : 'border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] hover:text-white'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
