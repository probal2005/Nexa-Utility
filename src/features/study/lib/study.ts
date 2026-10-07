import type {
  GPAResult,
  GradeScale,
  Subject,
} from '../types';

export const DEFAULT_GRADE_SCALE: GradeScale[] = [
  {
    grade: 'A+',
    minPercentage: 90,
    maxPercentage: 100,
    gradePoint: 10,
  },
  {
    grade: 'A',
    minPercentage: 80,
    maxPercentage: 89.99,
    gradePoint: 9,
  },
  {
    grade: 'B+',
    minPercentage: 70,
    maxPercentage: 79.99,
    gradePoint: 8,
  },
  {
    grade: 'B',
    minPercentage: 60,
    maxPercentage: 69.99,
    gradePoint: 7,
  },
  {
    grade: 'C',
    minPercentage: 50,
    maxPercentage: 59.99,
    gradePoint: 6,
  },
  {
    grade: 'D',
    minPercentage: 40,
    maxPercentage: 49.99,
    gradePoint: 5,
  },
  {
    grade: 'F',
    minPercentage: 0,
    maxPercentage: 39.99,
    gradePoint: 0,
  },
];

export function calculatePercentage(
  obtained: number,
  total: number,
): number {
  if (
    !Number.isFinite(obtained) ||
    !Number.isFinite(total) ||
    total <= 0
  ) {
    return 0;
  }

  return (
    (obtained / total) * 100
  );
}

export function getGrade(
  percentage: number,
  scale: GradeScale[] =
    DEFAULT_GRADE_SCALE,
): GradeScale {
  const normalized = Math.max(
    0,
    Math.min(100, percentage),
  );

  return (
    scale.find(
      (item) =>
        normalized >=
          item.minPercentage &&
        normalized <=
          item.maxPercentage,
    ) ?? scale[scale.length - 1]
  );
}

export function calculateGPA(
  subjects: Subject[],
  scale: GradeScale[] =
    DEFAULT_GRADE_SCALE,
): GPAResult {
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (const subject of subjects) {
    if (
      subject.credits <= 0 ||
      subject.maxMarks <= 0
    ) {
      continue;
    }

    const percentage =
      calculatePercentage(
        subject.marks,
        subject.maxMarks,
      );

    const grade =
      getGrade(
        percentage,
        scale,
      );

    totalCredits +=
      subject.credits;

    totalGradePoints +=
      grade.gradePoint *
      subject.credits;
  }

  return {
    gpa:
      totalCredits > 0
        ? totalGradePoints /
          totalCredits
        : 0,
    totalCredits,
    totalGradePoints,
  };
}

export function calculateCGPA(
  gpas: number[],
): number {
  const valid = gpas.filter(
    (gpa) =>
      Number.isFinite(gpa) &&
      gpa >= 0,
  );

  if (valid.length === 0) {
    return 0;
  }

  return (
    valid.reduce(
      (sum, gpa) =>
        sum + gpa,
      0,
    ) / valid.length
  );
}

export function formatGPA(
  value: number,
): string {
  return value.toFixed(2);
}

export function marksNeededForPercentage(
  totalMarks: number,
  targetPercentage: number,
): number {
  if (totalMarks <= 0) {
    return 0;
  }

  return (
    totalMarks *
    (targetPercentage / 100)
  );
}

export function percentageToDecimal(
  percentage: number,
): number {
  return percentage / 100;
}

export function formatCountdown(
  targetDate: string,
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const difference =
    new Date(
      targetDate,
    ).getTime() -
    Date.now();

  const remaining = Math.max(
    0,
    difference,
  );

  const days = Math.floor(
    remaining /
      (1000 * 60 * 60 * 24),
  );

  const hours = Math.floor(
    (remaining /
      (1000 * 60 * 60)) %
      24,
  );

  const minutes = Math.floor(
    (remaining /
      (1000 * 60)) %
      60,
  );

  const seconds = Math.floor(
    (remaining / 1000) %
      60,
  );

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export function formatStudyDuration(
  minutes: number,
): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours =
    Math.floor(minutes / 60);

  const remaining =
    minutes % 60;

  return remaining > 0
    ? `${hours}h ${remaining}m`
    : `${hours}h`;
}
