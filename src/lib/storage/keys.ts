export const STORAGE_KEYS = {
  settings: "nexa-utility-settings",

  notes: "nexa-utility-notes",
  reminders: "nexa-utility-reminders",
  calendarEvents: "nexa-utility-calendar-events",
  tasks: "nexa-utility-tasks",

  profile: "nexa-utility-profile",
  photos: "nexa-utility-photos",
  cameraPhotos: "nexa-utility-camera-photos",

  notifications: "nexa-utility-notifications",
  permissions: "nexa-utility-permission-settings",

  calculatorHistory: "nexa-calculator-history",

  pomodoroSettings: "nexa-utility-pomodoro-settings",
  pomodoroSessions: "nexa-utility-pomodoro-sessions",

  studySessions: "nexa-utility-study-sessions",
  studyExams: "nexa-utility-study-exams",
  studyPlanner: "nexa-utility-study-planner",
  gpaSubjects: "nexa-utility-gpa-subjects",

  workspaceTabs: "nexa-utility-workspace-tabs",

  recentTools: "nexa-utility-recent-tools",
  shortcuts: "nexa-utility-shortcuts",
  theme: "nexa-utility-theme",
  weatherLocation: "nexa-utility-weather-location",
  commandHistory: "nexa-utility-command-history",
} as const;

export type StorageKey =
  (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
