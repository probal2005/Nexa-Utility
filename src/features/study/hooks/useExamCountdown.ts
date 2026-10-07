'use client';

import { useEffect, useState } from 'react';
import {
  getExamCountdown,
  type ExamCountdown,
} from '@/features/study/lib/exams';

export function useExamCountdown(
  examDate: string,
): ExamCountdown {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return getExamCountdown(examDate, now);
}
