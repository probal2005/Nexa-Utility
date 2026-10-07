"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { localStorageAdapter } from "@/lib/storage";

import type {
  PlannerFilter,
  PlannerItem,
  PlannerItemType,
  PlannerPriority,
  PlannerStatus,
} from "@/features/study/planner/types";

import {
  PLANNER_STORAGE_KEY,
  createPlannerId,
  isPlannerOverdue,
  isPlannerToday,
  sortPlannerItems,
} from "@/features/study/planner/lib/planner";

function readPlannerItems(): PlannerItem[] {
  const stored = localStorageAdapter.get<unknown>(
    PLANNER_STORAGE_KEY,
  );

  return Array.isArray(stored)
    ? (stored as PlannerItem[])
    : [];
}

export function useAcademicPlanner() {
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<PlannerFilter>("all");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readPlannerItems());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    localStorageAdapter.set(
      PLANNER_STORAGE_KEY,
      items,
    );
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      data: Omit<
        PlannerItem,
        "id" | "createdAt" | "completedAt"
      >,
    ) => {
      const item: PlannerItem = {
        ...data,
        id: createPlannerId(),
        createdAt: Date.now(),
        completedAt:
          data.status === "completed"
            ? Date.now()
            : null,
      };

      setItems((current) => [...current, item]);

      return item;
    },
    [],
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<PlannerItem>) => {
      setItems((current) =>
        current.map((item) => {
          if (item.id !== id) {
            return item;
          }

          const nextStatus =
            updates.status ?? item.status;

          return {
            ...item,
            ...updates,
            completedAt:
              nextStatus === "completed"
                ? item.completedAt ?? Date.now()
                : null,
          };
        }),
      );
    },
    [],
  );

  const toggleComplete = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const completed =
          item.status === "completed";

        return {
          ...item,
          status: completed
            ? "pending"
            : "completed",
          completedAt: completed
            ? null
            : Date.now(),
        };
      }),
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id),
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setItems((current) =>
      current.filter(
        (item) => item.status !== "completed",
      ),
    );
  }, []);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = items.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      switch (filter) {
        case "pending":
          return item.status === "pending";

        case "in-progress":
          return item.status === "in-progress";

        case "completed":
          return item.status === "completed";

        case "overdue":
          return isPlannerOverdue(item);

        case "today":
          return isPlannerToday(item);

        case "all":
        default:
          return true;
      }
    });

    return sortPlannerItems(result);
  }, [items, search, filter]);

  const stats = useMemo(() => {
    return {
      total: items.length,

      pending: items.filter(
        (item) => item.status === "pending",
      ).length,

      inProgress: items.filter(
        (item) => item.status === "in-progress",
      ).length,

      completed: items.filter(
        (item) => item.status === "completed",
      ).length,

      overdue: items.filter(isPlannerOverdue).length,

      today: items.filter(isPlannerToday).length,
    };
  }, [items]);

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((item) => item.subject.trim())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const typeCounts = useMemo(() => {
    const counts: Record<PlannerItemType, number> = {
      assignment: 0,
      project: 0,
      deadline: 0,
      "study-goal": 0,
    };

    items.forEach((item) => {
      counts[item.type] += 1;
    });

    return counts;
  }, [items]);

  const priorityCounts = useMemo(() => {
    const counts: Record<PlannerPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };

    items.forEach((item) => {
      counts[item.priority] += 1;
    });

    return counts;
  }, [items]);

  const statusCounts = useMemo(() => {
    const counts: Record<PlannerStatus, number> = {
      pending: 0,
      "in-progress": 0,
      completed: 0,
    };

    items.forEach((item) => {
      counts[item.status] += 1;
    });

    return counts;
  }, [items]);

  return {
    items,
    filteredItems,
    subjects,
    typeCounts,
    priorityCounts,
    statusCounts,
    stats,
    search,
    setSearch,
    filter,
    setFilter,
    hydrated,
    addItem,
    updateItem,
    toggleComplete,
    deleteItem,
    clearCompleted,
  };
}
