'use client';

import type {
  PomodoroSettings,
} from '../types';

type PomodoroSettingsProps = {
  settings: PomodoroSettings;
  onChange: (
    updates: Partial<PomodoroSettings>,
  ) => void;
};

export function PomodoroSettings({
  settings,
  onChange,
}: PomodoroSettingsProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-sm font-semibold text-white">
        Timer settings
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            'Focus',
            'focusMinutes',
            settings.focusMinutes,
          ],
          [
            'Short break',
            'shortBreakMinutes',
            settings.shortBreakMinutes,
          ],
          [
            'Long break',
            'longBreakMinutes',
            settings.longBreakMinutes,
          ],
          [
            'Sessions before long break',
            'sessionsBeforeLongBreak',
            settings.sessionsBeforeLongBreak,
          ],
        ].map(
          ([label, key, value]) => (
            <label
              key={key}
              className="space-y-2"
            >
              <span className="block text-xs text-zinc-500">
                {label}
              </span>

              <input
                type="number"
                min={1}
                max={120}
                value={value as number}
                onChange={(event) =>
                  onChange({
                    [key as string]:
                      Math.max(
                        1,
                        Number(
                          event.target
                            .value,
                        ),
                      ),
                  })
                }
                className="h-11 w-full rounded-2xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-white/20"
              />
            </label>
          ),
        )}
      </div>
    </section>
  );
}
