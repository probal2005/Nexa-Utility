"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { localStorageAdapter } from "@/lib/storage";

import type { Exam } from "@/features/study/types";

const STORAGE_KEY = "nexa-utility-study-exams";

function createId(): string {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function readStoredExams(): Exam[] {
  const stored = localStorageAdapter.get<unknown>(
    STORAGE_KEY,
  );

  return Array.isArray(stored)
    ? (stored as Exam[])
    : [];
}

export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setExams(readStoredExams());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorageAdapter.set(
      STORAGE_KEY,
      exams,
    );
  }, [exams, hydrated]);

  const addExam = useCallback((exam?: Exam) => {
    const nextExam: Exam = exam ?? {
      id: createId(),
      name: "",
      subject: "",
      date: new Date().toISOString(),
      createdAt: Date.now(),
    };

    setExams((current) => [
      ...current,
      nextExam,
    ]);

    return nextExam;
  }, []);

  const updateExam = useCallback(
    (id: string, updates: Partial<Exam>) => {
      setExams((current) =>
        current.map((exam) =>
          exam.id === id
            ? {
                ...exam,
                ...updates,
              }
            : exam,
        ),
      );
    },
    [],
  );

  const deleteExam = useCallback((id: string) => {
    setExams((current) =>
      current.filter((exam) => exam.id !== id),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    const now = Date.now();

    setExams((current) =>
      current.filter(
        (exam) =>
          new Date(exam.date).getTime() > now,
      ),
    );
  }, []);

  const filteredExams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return exams;
    }

    return exams.filter((exam) => {
      return (
        exam.name.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query)
      );
    });
  }, [exams, search]);

  const upcomingCount = useMemo(() => {
    const now = Date.now();

    return exams.filter(
      (exam) =>
        new Date(exam.date).getTime() > now,
    ).length;
  }, [exams]);

  const completedCount = useMemo(() => {
    const now = Date.now();

    return exams.filter(
      (exam) =>
        new Date(exam.date).getTime() <= now,
    ).length;
  }, [exams]);

  return {
    exams,
    filteredExams,
    search,
    setSearch,
    upcomingCount,
    completedCount,
    hydrated,
    addExam,
    updateExam,
    deleteExam,
    clearCompleted,
  };
}
