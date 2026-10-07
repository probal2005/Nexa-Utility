"use client";

import { useEffect, useMemo, useState } from "react";

import { localStorageAdapter } from "@/lib/storage";

import type { Subject } from "@/features/study/types";

import {
  calculateSemesterGPA,
  calculateSubjects,
  createSubject,
} from "@/features/study/lib/gpa";

const STORAGE_KEY = "nexa-utility-gpa-subjects";

function loadSubjects(): Subject[] {
  const stored = localStorageAdapter.get<unknown>(
    STORAGE_KEY,
  );

  if (!Array.isArray(stored) || stored.length === 0) {
    return [createSubject()];
  }

  return stored as Subject[];
}

export function useGPA() {
  const [subjects, setSubjects] =
    useState<Subject[]>(loadSubjects);

  useEffect(() => {
    localStorageAdapter.set(
      STORAGE_KEY,
      subjects,
    );
  }, [subjects]);

  const calculatedSubjects = useMemo(
    () => calculateSubjects(subjects),
    [subjects],
  );

  const result = useMemo(
    () => calculateSemesterGPA(subjects),
    [subjects],
  );

  function addSubject() {
    setSubjects((current) => [
      ...current,
      createSubject(),
    ]);
  }

  function updateSubject(
    id: string,
    updates: Partial<Subject>,
  ) {
    setSubjects((current) =>
      current.map((subject) =>
        subject.id === id
          ? { ...subject, ...updates }
          : subject,
      ),
    );
  }

  function removeSubject(id: string) {
    setSubjects((current) => {
      const next = current.filter(
        (subject) => subject.id !== id,
      );

      return next.length > 0
        ? next
        : [createSubject()];
    });
  }

  function reset() {
    setSubjects([createSubject()]);
  }

  return {
    subjects,
    calculatedSubjects,
    result,
    addSubject,
    updateSubject,
    removeSubject,
    reset,
  };
}
