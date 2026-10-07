"use client";

import {
  ReactNode,
  useEffect,
  useState,
} from "react";

import { on } from "@/lib/events";

import {
  DEFAULT_SETTINGS,
  type NexaTheme,
} from "../types";

import { loadSettings } from "../lib/settings";

type SettingsProviderProps = {
  children: ReactNode;
};

function applyTheme(theme: NexaTheme) {
  const root =
    document.documentElement;

  root.setAttribute(
    "data-nexa-theme",
    theme,
  );

  root.style.colorScheme =
    theme === "white"
      ? "light"
      : "dark";
}

export default function SettingsProvider({
  children,
}: SettingsProviderProps) {
  const [theme, setTheme] =
    useState<NexaTheme>(() => {
      return loadSettings().theme;
    });

  useEffect(() => {
    applyTheme(theme);

    return on("settings:changed", () => {
      const loaded = loadSettings();

      setTheme(loaded.theme);
      applyTheme(loaded.theme);
    });
  }, [theme]);

  useEffect(() => {
    const current =
      document.documentElement.getAttribute(
        "data-nexa-theme",
      );

    if (!current) {
      applyTheme(
        theme || DEFAULT_SETTINGS.theme,
      );
    }
  }, [theme]);

  return <>{children}</>;
}
