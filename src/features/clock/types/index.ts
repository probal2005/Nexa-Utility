export type ClockFormat = "12h" | "24h";

export interface StopwatchState {
  elapsed: number;
  running: boolean;
}

export interface TimerState {
  duration: number;
  remaining: number;
  running: boolean;
  completed: boolean;
}