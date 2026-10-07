import type { GPAResult, Subject } from '@/features/study/types';
import { getGrade } from './study';

export type SubjectCalculation = Subject & {
  percentage: number;
  grade: string;
  gradePoint: number;
  weightedGradePoints: number;
};

export function calculateSubject(
  subject: Subject,
): SubjectCalculation {
  const percentage =
    subject.maxMarks > 0
      ? (subject.marks / subject.maxMarks) * 100
      : 0;

  const gradeResult = getGrade(percentage);

  return {
    ...subject,
    percentage,
    grade: gradeResult.grade,
    gradePoint: gradeResult.gradePoint,
    weightedGradePoints: gradeResult.gradePoint * subject.credits,
  };
}

export function calculateSubjects(
  subjects: Subject[],
): SubjectCalculation[] {
  return subjects.map(calculateSubject);
}

export function calculateSemesterGPA(
  subjects: Subject[],
): GPAResult {
  if (subjects.length === 0) {
    return {
      gpa: 0,
      totalCredits: 0,
      totalGradePoints: 0,
    };
  }

  const calculated = calculateSubjects(subjects);

  const totalCredits = calculated.reduce(
    (total, subject) => total + subject.credits,
    0,
  );

  const totalGradePoints = calculated.reduce(
    (total, subject) => total + subject.weightedGradePoints,
    0,
  );

  const gpa =
    totalCredits > 0
      ? totalGradePoints / totalCredits
      : 0;

  return {
    gpa,
    totalCredits,
    totalGradePoints,
  };
}

export function calculateCGPA(
  semesterGPAs: number[],
): number {
  if (semesterGPAs.length === 0) {
    return 0;
  }

  const validGPAs = semesterGPAs.filter(
    (gpa) => Number.isFinite(gpa) && gpa >= 0,
  );

  if (validGPAs.length === 0) {
    return 0;
  }

  return (
    validGPAs.reduce((total, gpa) => total + gpa, 0) /
    validGPAs.length
  );
}

export function createSubject(): Subject {
  return {
    id: crypto.randomUUID(),
    name: '',
    credits: 3,
    marks: 0,
    maxMarks: 100,
  };
}
