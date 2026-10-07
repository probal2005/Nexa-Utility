export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high';

export type TaskStatus =
  | 'todo'
  | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
};

export type TaskFilter =
  | 'all'
  | 'active'
  | 'completed'
  | 'high';

export type PomodoroMode =
  | 'focus'
  | 'short-break'
  | 'long-break';

export type PomodoroSession = {
  id: string;
  mode: PomodoroMode;
  duration: number;
  startedAt: number;
  completedAt: number | null;
  completed: boolean;
};
