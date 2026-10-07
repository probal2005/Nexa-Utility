"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { on } from "@/lib/events";
import { AVAILABLE_TOOLS } from "@/config/tools";
import {
  loadShortcuts,
  saveShortcuts,
} from "@/features/settings/lib/shortcuts";
import {
  House,
  Pin,
  ShieldCheck,
  Settings,
  UserRound,
} from "lucide-react";

const TOP_APPS = [
  {
    id: undefined,
    href: "/",
    name: "Home",
    icon: House,
  },
  {
    id: undefined,
    href: "/profile",
    name: "Profile",
    icon: UserRound,
  },
  {
    id: undefined,
    href: "/settings",
    name: "Settings",
    icon: Settings,
  },
  {
    id: undefined,
    href: "/privacy",
    name: "Privacy",
    icon: ShieldCheck,
  },
];

export function AppDock() {
  const pathname = usePathname();
  const [shortcutIds, setShortcutIds] =
    useState<string[]>([]);

  useEffect(() => {
    const refreshShortcuts = () =>
      setShortcutIds(loadShortcuts());

    refreshShortcuts();

    return on(
      "shortcuts:changed",
      refreshShortcuts,
    );
  }, []);

  const orderedTools =
    [...AVAILABLE_TOOLS].sort(
      (left, right) => {
        const leftPosition =
          shortcutIds.indexOf(left.id);

        const rightPosition =
          shortcutIds.indexOf(right.id);

        const leftRank =
          leftPosition < 0
            ? Number.MAX_SAFE_INTEGER
            : leftPosition;

        const rightRank =
          rightPosition < 0
            ? Number.MAX_SAFE_INTEGER
            : rightPosition;

        return leftRank - rightRank;
      },
    );

  const apps = [
    ...TOP_APPS,
    ...orderedTools.map(
      ({
        id,
        href,
        name,
        icon,
      }) => ({
        id,
        href,
        name,
        icon,
      }),
    ),
  ].filter(
    (app, index, allApps) =>
      allApps.findIndex(
        (candidate) =>
          candidate.href === app.href,
      ) === index,
  );

  function togglePinnedTool(id: string) {
    const next = shortcutIds.includes(id)
      ? shortcutIds.filter(
          (shortcutId) =>
            shortcutId !== id,
        )
      : [...shortcutIds, id];

    setShortcutIds(next);
    saveShortcuts(next);
  }

  return (
    <aside className="fixed bottom-24 left-3 top-[4.75rem] z-20 hidden w-[4.75rem] lg:block">
      <nav
        aria-label="App shortcuts"
        className="nexa-app-dock flex h-full flex-col items-center gap-1 overflow-y-auto rounded-2xl px-1.5 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {apps.map(
          ({
            id,
            href,
            name,
            icon: Icon,
          }) => {
            const active =
              pathname === href;

            const pinned =
              id
                ? shortcutIds.includes(id)
                : false;

            return (
              <div
                key={href}
                className="group relative w-full shrink-0"
              >
                <Link
                  href={href}
                  title={name}
                  aria-label={name}
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={`flex min-h-[3.65rem] w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-center transition ${
                    active
                      ? "nexa-app-dock-active"
                      : "nexa-app-dock-item"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />

                  <span className="line-clamp-2 text-[9px] leading-3">
                    {name}
                  </span>
                </Link>

                {id && (
                  <button
                    type="button"
                    aria-label={
                      pinned
                        ? `Unpin ${name}`
                        : `Pin ${name}`
                    }
                    aria-pressed={pinned}
                    title={
                      pinned
                        ? `Unpin ${name}`
                        : `Pin ${name}`
                    }
                    onClick={() =>
                      togglePinnedTool(id)
                    }
                    className={`absolute right-0.5 top-0.5 z-10 flex h-5 w-5 items-center justify-center rounded-md transition ${
                      pinned
                        ? "nexa-app-pin-active opacity-100"
                        : "nexa-app-pin-action opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                    }`}
                  >
                    <Pin className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          },
        )}
      </nav>
    </aside>
  );
}
