export type CalendarEventSource =
  | "manual"
  | "reminder"
  | "task";

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  time?: string;
  description?: string;
  createdAt: number;
  source?: CalendarEventSource;
  sourceId?: string;
};
