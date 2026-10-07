export type StudyAnalyticsStats = {
  totalStudyMinutes: number;
  todayStudyMinutes: number;
  totalSessions: number;
  completedSessions: number;
  upcomingExams: number;
  plannerTotal: number;
  plannerCompleted: number;
  plannerPending: number;
  plannerOverdue: number;
};

export type WeeklyStudyData = {
  day: string;
  date: string;
  minutes: number;
  sessions: number;
};

export type AnalyticsData = {
  stats: StudyAnalyticsStats;
  weeklyStudy: WeeklyStudyData[];
};
