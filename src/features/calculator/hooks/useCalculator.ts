"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { calculateExpression } from "@/features/calculator/lib/calculator";
import type { CalculationHistoryItem } from "@/features/calculator/types";
import {
  localStorageAdapter,
  STORAGE_KEYS,
} from "@/lib/storage";

function getExpressionFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(
    window.location.search,
  );

  const expression =
    params.get("expression");

  if (!expression?.trim()) {
    return null;
  }

  return expression.trim();
}

export function useCalculator() {
  const [expression, setExpression] =
    useState("");

  const [result, setResult] =
    useState("0");

  const [history, setHistory] =
    useState<CalculationHistoryItem[]>(
      [],
    );

  useEffect(() => {
    const stored =
      localStorageAdapter.get<unknown>(
        STORAGE_KEYS.calculatorHistory,
      );

    if (Array.isArray(stored)) {
      setHistory(
        stored as CalculationHistoryItem[],
      );
    } else {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    const urlExpression =
      getExpressionFromUrl();

    if (!urlExpression) {
      return;
    }

    setExpression(urlExpression);

    try {
      const calculated =
        calculateExpression(
          urlExpression,
        );

      setResult(calculated);
    } catch {
      setResult("Error");
    }

    const url = new URL(
      window.location.href,
    );

    url.searchParams.delete(
      "expression",
    );

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${
        url.search
          ? url.search
          : ""
      }`,
    );
  }, []);

  const saveHistory =
    useCallback(
      (
        item: CalculationHistoryItem,
      ) => {
        setHistory((current) => {
          const updated = [
            item,
            ...current,
          ].slice(0, 20);

          localStorageAdapter.set(
            STORAGE_KEYS.calculatorHistory,
            updated,
          );

          return updated;
        });
      },
      [],
    );

  const append = useCallback(
    (value: string) => {
      setExpression(
        (current) =>
          `${current}${value}`,
      );
    },
    [],
  );

  const clear = useCallback(() => {
    setExpression("");
    setResult("0");
  }, []);

  const backspace =
    useCallback(() => {
      setExpression(
        (current) =>
          current.slice(0, -1),
      );
    }, []);

  const calculate =
    useCallback(() => {
      if (!expression.trim()) {
        return;
      }

      try {
        const calculated =
          calculateExpression(
            expression,
          );

        setResult(calculated);

        saveHistory({
          id: crypto.randomUUID(),
          expression,
          result: calculated,
          createdAt: Date.now(),
        });
      } catch {
        setResult("Error");
      }
    }, [
      expression,
      saveHistory,
    ]);

  const selectHistoryItem =
    useCallback(
      (
        item: CalculationHistoryItem,
      ) => {
        setExpression(
          item.expression,
        );

        setResult(item.result);
      },
      [],
    );

  const clearHistory =
    useCallback(() => {
      localStorageAdapter.remove(
        STORAGE_KEYS.calculatorHistory,
      );

      setHistory([]);
    }, []);

  useEffect(() => {
    const handleKeyboard = (
      event: KeyboardEvent,
    ) => {
      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        append(key);
        return;
      }

      if (
        [
          "+",
          "-",
          "*",
          "/",
          "(",
          ")",
          ".",
        ].includes(key)
      ) {
        event.preventDefault();

        const displayValue =
          key === "*"
            ? "×"
            : key === "/"
              ? "÷"
              : key;

        append(displayValue);
        return;
      }

      if (
        key === "Enter" ||
        key === "="
      ) {
        event.preventDefault();
        calculate();
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        backspace();
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        clear();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyboard,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboard,
      );
    };
  }, [
    append,
    backspace,
    calculate,
    clear,
  ]);

  return {
    expression,
    result,
    history,
    append,
    clear,
    backspace,
    calculate,
    selectHistoryItem,
    clearHistory,
  };
}
