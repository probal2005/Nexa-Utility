"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createTask,
  filterTasks,
  getStoredTasks,
  saveTasks,
  sortTasks,
  toggleTask,
  updateTask,
} from "../lib/tasks";

import type {
  Task,
  TaskFilter,
  TaskPriority,
} from "../types";

export function useTasks() {
  const [
    tasks,
    setTasks,
  ] = useState<Task[]>([]);

  const [
    filter,
    setFilter,
  ] = useState<TaskFilter>("all");

  const [
    query,
    setQuery,
  ] = useState("");

  useEffect(() => {
    setTasks(getStoredTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback(
    (
      title: string,
      description = "",
      priority: TaskPriority = "medium",
      dueDate: string | null = null,
    ) => {
      if (!title.trim()) {
        return;
      }

      setTasks((current) => [
        createTask(
          title,
          description,
          priority,
          dueDate,
        ),
        ...current,
      ]);
    },
    [],
  );

  const editTask = useCallback(
    (
      id: string,
      updates: Partial<Task>,
    ) => {
      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? updateTask(
                task,
                updates,
              )
            : task,
        ),
      );
    },
    [],
  );

  const completeTask =
    useCallback((id: string) => {
      setTasks((current) =>
        current.map((task) =>
          task.id === id
            ? toggleTask(task)
            : task,
        ),
      );
    }, []);

  const deleteTask =
    useCallback((id: string) => {
      setTasks((current) =>
        current.filter(
          (task) => task.id !== id,
        ),
      );
    }, []);

  const clearCompleted =
    useCallback(() => {
      setTasks((current) =>
        current.filter(
          (task) =>
            task.status !==
            "completed",
        ),
      );
    }, []);

  const visibleTasks = useMemo(
    () =>
      sortTasks(
        filterTasks(
          tasks,
          filter,
          query,
        ),
      ),
    [tasks, filter, query],
  );

  const stats = useMemo(() => {
    const completed =
      tasks.filter(
        (task) =>
          task.status ===
          "completed",
      ).length;

    const active =
      tasks.length - completed;

    const high =
      tasks.filter(
        (task) =>
          task.priority ===
            "high" &&
          task.status === "todo",
      ).length;

    return {
      total: tasks.length,
      active,
      completed,
      high,
    };
  }, [tasks]);

  return {
    tasks,
    visibleTasks,
    stats,
    filter,
    setFilter,
    query,
    setQuery,
    addTask,
    editTask,
    completeTask,
    deleteTask,
    clearCompleted,
  };
}
