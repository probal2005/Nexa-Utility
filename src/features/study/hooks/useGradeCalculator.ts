'use client';

import { useMemo, useState } from 'react';
import {
  calculateGradeFromMarks,
  calculateMarksNeeded,
  calculatePercentage,
} from '@/features/study/lib/percentage';

export function useGradeCalculator() {
  const [marks, setMarks] = useState(75);
  const [maxMarks, setMaxMarks] = useState(100);
  const [targetPercentage, setTargetPercentage] = useState(80);

  const percentageResult = useMemo(
    () => calculatePercentage(marks, maxMarks),
    [marks, maxMarks],
  );

  const gradeResult = useMemo(
    () => calculateGradeFromMarks(marks, maxMarks),
    [marks, maxMarks],
  );

  const marksNeeded = useMemo(
    () =>
      calculateMarksNeeded(
        marks,
        maxMarks,
        targetPercentage,
      ),
    [marks, maxMarks, targetPercentage],
  );

  return {
    marks,
    setMarks,
    maxMarks,
    setMaxMarks,
    targetPercentage,
    setTargetPercentage,
    percentageResult,
    gradeResult,
    marksNeeded,
  };
}
