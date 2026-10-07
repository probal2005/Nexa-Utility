import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import type { ParsedCommand } from "../types/command";

export function executeCommand(
  command: ParsedCommand,
  router: AppRouterInstance,
): boolean {
  switch (command.action) {
    case "open-tool": {
      if (!command.tool) {
        return false;
      }

      router.push(command.tool.href);
      return true;
    }

    case "calculator": {
      router.push(
        `/calculator?expression=${encodeURIComponent(
          command.expression ?? "",
        )}`,
      );

      return true;
    }

    case "timer": {
      const seconds = command.value ?? 0;

      router.push(
        `/clock?timer=${encodeURIComponent(
          String(seconds),
        )}`,
      );

      return true;
    }

    case "search-tool": {
      return false;
    }

    case "unknown": {
      return false;
    }

    default: {
      return false;
    }
  }
}
