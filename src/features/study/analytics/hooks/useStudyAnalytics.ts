"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getStudyAnalytics,
} from "../lib/analytics";

import type { AnalyticsData } from "../types";

const EMPTY_DATA: AnalyticsData = {
  stats: {
    totalStudyMinutes: 0,
    todayStudyMinutes: 0,
    totalSessions: 0,
    completedSessions: 0,
    upcomingExams: 0,
    plannerTotal: 0,
    plannerCompleted: 0,
    plannerPending: 0,
    plannerOverdue: 0,
  },
  weeklyStudy: [],
};

export function useStudyAnalytics() {
  const [data, setData] = useState<AnalyticsData>(EMPTY_DATA);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setData(getStudyAnalytics());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);

    const handleStorage = () => {
      refresh();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [refresh]);

  return {
    ...data,
    hydrated,
    refresh,
  };
}
