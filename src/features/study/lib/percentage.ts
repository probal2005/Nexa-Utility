import { getGrade } from './study';

export type PercentageResult = {
  percentage: number;
  marks: number;
  maxMarks: number;
};

export function calculatePercentage(
  marks: number,
  maxMarks: number,
): PercentageResult {
  const safeMarks = Math.max(0, marks);
  const safeMaxMarks = Math.max(1, maxMarks);

  return {
    marks: safeMarks,
    maxMarks: safeMaxMarks,
    percentage: (safeMarks / safeMaxMarks) * 100,
  };
}

export function calculateMarksNeeded(
  currentMarks: number,
  maxMarks: number,
  targetPercentage: number,
): number {
  const safeMaxMarks = Math.max(1, maxMarks);
  const target = Math.max(0, targetPercentage);

  const requiredTotal = (target / 100) * safeMaxMarks;

  return Math.max(0, requiredTotal - Math.max(0, currentMarks));
}

export function calculateTargetPercentage(
  currentMarks: number,
  maxMarks: number,
  targetMarks: number,
): number {
  const safeMaxMarks = Math.max(1, maxMarks);
  const requiredMarks = Math.max(0, targetMarks);

  return (
    ((Math.max(0, currentMarks) + requiredMarks) /
      safeMaxMarks) *
    100
  );
}

export function calculateGradeFromMarks(
  marks: number,
  maxMarks: number,
) {
  const result = calculatePercentage(marks, maxMarks);

  return {
    ...result,
    ...getGrade(result.percentage),
  };
}
