export type PomodoroMode =
  | 'focus'
  | 'short-break'
  | 'long-break';

export type PomodoroSettings = {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
};

export type PomodoroSession = {
  id: string;
  mode: PomodoroMode;
  duration: number;
  startedAt: number;
  completedAt: number | null;
  completed: boolean;
};

export type PomodoroStats = {
  completedFocusSessions: number;
  completedBreaks: number;
  totalFocusMinutes: number;
  todayFocusMinutes: number;
};
