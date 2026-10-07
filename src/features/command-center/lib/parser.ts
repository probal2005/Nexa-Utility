import {
  AVAILABLE_TOOLS,
  searchTools,
} from "@/config/tools";

import type { ParsedCommand } from "../types/command";

const TIMER_PATTERNS = [
  /^(\d+(?:\.\d+)?)\s*(second|seconds|sec|secs|s)$/i,
  /^(\d+(?:\.\d+)?)\s*(minute|minutes|min|mins|m)$/i,
  /^(\d+(?:\.\d+)?)\s*(hour|hours|hr|hrs|h)$/i,
];

const CALCULATOR_PATTERN =
  /^(?:calculate|calculator|calc)\s+(.+)$/i;

const TIMER_PREFIX_PATTERN =
  /^(?:set\s+)?(?:a\s+)?timer\s+(?:for\s+)?(.+)$/i;

const OPEN_PATTERN =
  /^(?:open|launch|go\s+to|show)\s+(.+)$/i;

const NEW_NOTE_PATTERN =
  /^(?:new|create)\s+(?:a\s+)?note$/i;

const MATH_EXPRESSION_PATTERN =
  /^[0-9+\-*/().\s×÷−%]+$/;

function parseTimerValue(
  value: string,
): number | null {
  const normalized =
    value.trim();

  for (const pattern of TIMER_PATTERNS) {
    const match =
      normalized.match(pattern);

    if (!match) {
      continue;
    }

    const amount = Number(
      match[1],
    );

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return null;
    }

    const unit =
      match[2].toLowerCase();

    if (
      [
        "second",
        "seconds",
        "sec",
        "secs",
        "s",
      ].includes(unit)
    ) {
      return amount;
    }

    if (
      [
        "minute",
        "minutes",
        "min",
        "mins",
        "m",
      ].includes(unit)
    ) {
      return amount * 60;
    }

    if (
      [
        "hour",
        "hours",
        "hr",
        "hrs",
        "h",
      ].includes(unit)
    ) {
      return amount * 60 * 60;
    }
  }

  return null;
}

function findTool(input: string) {
  const results =
    searchTools(input);

  if (results.length > 0) {
    return results[0];
  }

  const normalized =
    input.trim().toLowerCase();

  return AVAILABLE_TOOLS.find(
    (tool) =>
      tool.name.toLowerCase() ===
        normalized ||
      tool.id.toLowerCase() ===
        normalized,
  );
}

export function parseCommand(
  rawInput: string,
): ParsedCommand {
  const input =
    rawInput.trim();

  if (!input) {
    return {
      action: "unknown",
      input,
    };
  }

  /*
   * Timer:
   *
   * 25 minutes
   * 5 min
   * timer 30 seconds
   * set timer for 2 minutes
   */
  const timerPrefixMatch =
    input.match(
      TIMER_PREFIX_PATTERN,
    );

  if (timerPrefixMatch) {
    const timerValue =
      parseTimerValue(
        timerPrefixMatch[1],
      );

    if (timerValue !== null) {
      return {
        action: "timer",
        input,
        value: timerValue,
      };
    }
  }

  const directTimerValue =
    parseTimerValue(input);

  if (
    directTimerValue !== null
  ) {
    return {
      action: "timer",
      input,
      value: directTimerValue,
    };
  }

  /*
   * Calculator command.
   *
   * calculator 25 * 18
   * calculate 100 / 4
   */
  const calculatorMatch =
    input.match(
      CALCULATOR_PATTERN,
    );

  if (calculatorMatch) {
    return {
      action: "calculator",
      input,
      expression:
        calculatorMatch[1].trim(),
    };
  }

  /*
   * Raw mathematical expression.
   *
   * 25 * 18
   * 100 / 4
   * (20 + 5) * 2
   */
  if (
    MATH_EXPRESSION_PATTERN.test(
      input,
    ) &&
    /[0-9]/.test(input) &&
    /[+\-*/×÷−%]/.test(input)
  ) {
    return {
      action: "calculator",
      input,
      expression: input,
    };
  }

  /*
   * New note.
   */
  if (
    NEW_NOTE_PATTERN.test(input)
  ) {
    const tool =
      findTool("notes");

    return {
      action: "open-tool",
      input,
      tool,
    };
  }

  /*
   * Explicit open command.
   */
  const openMatch =
    input.match(OPEN_PATTERN);

  if (openMatch) {
    const tool = findTool(
      openMatch[1].trim(),
    );

    if (tool) {
      return {
        action: "open-tool",
        input,
        tool,
      };
    }
  }

  /*
   * Direct tool search.
   */
  const tool =
    findTool(input);

  if (tool) {
    return {
      action: "open-tool",
      input,
      tool,
    };
  }

  /*
   * Fall back to normal search.
   */
  return {
    action: "search-tool",
    input,
  };
}
