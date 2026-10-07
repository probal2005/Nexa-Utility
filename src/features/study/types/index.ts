export type GradeScale = {
  grade: string;
  minPercentage: number;
  maxPercentage: number;
  gradePoint: number;
};

export type Subject = {
  id: string;
  name: string;
  credits: number;
  marks: number;
  maxMarks: number;
};

export type GPAResult = {
  gpa: number;
  totalCredits: number;
  totalGradePoints: number;
};

export type StudySession = {
  id: string;
  subject: string;
  durationMinutes: number;
  startedAt: number;
  completedAt: number | null;
};

export type Exam = {
  id: string;
  name: string;
  subject: string;
  date: string;
  createdAt: number;
};
