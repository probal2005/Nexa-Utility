import type { Tool } from "@/types/tool";

export type CommandAction =
  | "open-tool"
  | "calculator"
  | "timer"
  | "search-tool"
  | "unknown";

export type ParsedCommand = {
  action: CommandAction;
  input: string;
  tool?: Tool;
  value?: number;
  expression?: string;
};
