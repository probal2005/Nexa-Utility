export type NexaTheme =
  | "black"
  | "white"
  | "midnight"
  | "ocean"
  | "forest";

export type SidebarSettings = {
  showShortcuts: boolean;
  showCategories: boolean;
  compact: boolean;
};

export type NexaSettings = {
  /**
   * User's preferred display name.
   * This is intentionally optional so Nexa works
   * without requiring profile setup.
   */
  displayName: string;

  theme: NexaTheme;

  sidebar: SidebarSettings;

  commandPaletteEnabled: boolean;
  commandPaletteShortcut: string;
  notificationsEnabled: boolean;
  clock24Hour: boolean;
};

export const DEFAULT_SETTINGS: NexaSettings = {
  displayName: "",

  theme: "black",

  sidebar: {
    showShortcuts: true,
    showCategories: true,
    compact: false,
  },

  commandPaletteEnabled: true,
  commandPaletteShortcut: "Ctrl+K",
  notificationsEnabled: true,
  clock24Hour: false,
};

export const THEMES: {
  id: NexaTheme;
  name: string;
  description: string;
  preview: string;
}[] = [
  {
    id: "black",
    name: "Black",
    description:
      "Pure premium black with soft glass surfaces.",
    preview: "#050505",
  },
  {
    id: "white",
    name: "White",
    description:
      "Clean white glass with subtle premium contrast.",
    preview: "#f8fafc",
  },
  {
    id: "midnight",
    name: "Midnight",
    description:
      "Deep blue-black glass with a cool glow.",
    preview: "#080d18",
  },
  {
    id: "ocean",
    name: "Ocean",
    description:
      "Dark glass with refined cyan and blue accents.",
    preview: "#06141a",
  },
  {
    id: "forest",
    name: "Forest",
    description:
      "Deep green glass with emerald highlights.",
    preview: "#07130d",
  },
];
