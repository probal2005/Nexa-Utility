import type { LucideIcon } from "lucide-react";

export type ToolCategory =
  | "core"
  | "utility"
  | "productivity"
  | "media"
  | "study"
  | "advanced";

export type Tool = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  category: ToolCategory;
  available: boolean;
  keywords: string[];
  featured?: boolean;
  mobile?: boolean;
};
