"use client";

import {
  GripVertical,
  House,
  ShieldCheck,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

import { NexaLogo } from "@/components/brand/NexaLogo";
import { localStorageAdapter, STORAGE_KEYS } from "@/lib/storage";
import { AVAILABLE_TOOLS } from "@/config/tools";
import type { LucideIcon } from "lucide-react";

type WorkspaceTab = {
  href: string;
  title: string;
};

type TabPointerDrag = {
  pointerId: number;
  sourceHref: string;
  startX: number;
  active: boolean;
};



const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/profile": "Profile",
  "/settings": "Settings",
  "/privacy": "Privacy Center",
};

const PAGE_ICONS: Record<string, LucideIcon> = {
  "/": House,
  "/profile": UserRound,
  "/privacy": ShieldCheck,
};

const SHORTCUT_PAGES = [
  { href: "/", title: "Home", icon: House },
  { href: "/profile", title: "Profile", icon: UserRound },
  { href: "/settings", title: "Settings", icon: Settings },
  { href: "/privacy", title: "Privacy Center", icon: ShieldCheck },
];

const APP_PAGES = [
  ...SHORTCUT_PAGES,
  ...AVAILABLE_TOOLS.map((tool) => ({
    href: tool.href,
    title: tool.name,
    icon: tool.icon,
  })),
].filter((page, index, pages) => pages.findIndex((candidate) => candidate.href === page.href) === index);

function getPageTitle(href: string) {
  return PAGE_TITLES[href] ??
    AVAILABLE_TOOLS.find((tool) => tool.href === href)?.name ??
    "Workspace";
}

function readTabs(): WorkspaceTab[] {
  const parsed =
    localStorageAdapter.get<unknown>(
      STORAGE_KEYS.workspaceTabs,
    );

  if (!Array.isArray(parsed)) return [];

  return parsed.filter(
    (tab): tab is WorkspaceTab =>
      typeof tab?.href === "string" &&
      typeof tab?.title === "string" &&
      tab.href.startsWith("/"),
  );
}

function saveTabs(tabs: WorkspaceTab[]): void {
  localStorageAdapter.set(
    STORAGE_KEYS.workspaceTabs,
    tabs,
  );
}

export function WorkspaceTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [tabs, setTabs] = useState<WorkspaceTab[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [dropTargetHref, setDropTargetHref] = useState<string | null>(null);
  const [enteringHref, setEnteringHref] = useState<string | null>(null);
  const [closingHref, setClosingHref] = useState<string | null>(null);
  const launcherRef = useRef<HTMLDivElement>(null);
  const tabStripRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const pointerTabDrag = useRef<TabPointerDrag | null>(null);
  const dropTargetHrefRef = useRef<string | null>(null);
  const previousPathname = useRef<string | null>(null);
  const closingTimeoutRef = useRef<number | null>(null);
  const finishCloseRef = useRef<(href: string) => void>(() => undefined);

  useEffect(() => {
    setTabs(readTabs());
    setHydrated(true);
  }, []);

  useEffect(() => () => {
    if (closingTimeoutRef.current !== null) {
      window.clearTimeout(closingTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    setTabs((current) => {
      const title = getPageTitle(pathname);
      const existing = current.find((tab) => tab.href === pathname);
      const next = existing
        ? current.map((tab) => tab.href === pathname ? { ...tab, title } : tab)
        : [...current, { href: pathname, title }];
      saveTabs(next);
      return next;
    });
  }, [hydrated, pathname]);

  useEffect(() => {
    setLauncherOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.remove("nexa-page-closing");
  }, [pathname]);

  useEffect(() => {
    if (!hydrated || previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    setEnteringHref(pathname);
    const timeout = window.setTimeout(() => {
      setEnteringHref((current) => current === pathname ? null : current);
    }, 480);
    return () => window.clearTimeout(timeout);
  }, [hydrated, pathname]);

  useEffect(() => {
    if (!hydrated) return;
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [hydrated, pathname]);

  useEffect(() => {
    if (!launcherOpen) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!launcherRef.current?.contains(event.target as Node)) {
        setLauncherOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setLauncherOpen(false);
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [launcherOpen]);

  function closeTab(href: string) {
    const index = tabs.findIndex((tab) => tab.href === href);
    const next = tabs.filter((tab) => tab.href !== href);
    const remaining = next.length > 0 ? next : [{ href: "/", title: "Home" }];
    document.documentElement.classList.remove("nexa-page-closing");
    setTabs(remaining);
    saveTabs(remaining);

    if (pathname === href) {
      const fallback = remaining[Math.max(0, index - 1)] ?? remaining[0];
      router.push(fallback?.href ?? "/");
    }
  }

  function requestCloseTab(href: string) {
    if (closingHref) return;
    const hasDifferentDestination = tabs.some((tab) => tab.href !== href) || href !== "/";
    if (pathname === href && hasDifferentDestination) {
      document.documentElement.classList.add("nexa-page-closing");
    }
    setClosingHref(href);
    closingTimeoutRef.current = window.setTimeout(() => {
      finishCloseRef.current(href);
    }, 300);
  }

  function finishClose(href: string) {
    if (closingTimeoutRef.current !== null) {
      window.clearTimeout(closingTimeoutRef.current);
      closingTimeoutRef.current = null;
    }
    closeTab(href);
    setClosingHref((current) => current === href ? null : current);
  }

  finishCloseRef.current = finishClose;

  function reorderTabs(sourceHref: string, targetHref: string) {
    if (!sourceHref || sourceHref === targetHref) return;

    setTabs((current) => {
      const sourceIndex = current.findIndex((tab) => tab.href === sourceHref);
      const targetIndex = current.findIndex((tab) => tab.href === targetHref);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const next = [...current];
      const [movedTab] = next.splice(sourceIndex, 1);
      const newTargetIndex = next.findIndex((tab) => tab.href === targetHref);
      next.splice(newTargetIndex, 0, movedTab);
      saveTabs(next);
      return next;
    });
  }

  function updateDropTarget(href: string | null) {
    dropTargetHrefRef.current = href;
    setDropTargetHref(href);
  }

  function handleTabPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = pointerTabDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      if (Math.abs(event.clientX - drag.startX) < 10) return;
      drag.active = true;
    }

    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>("[data-workspace-tab-href]")
      ?.dataset.workspaceTabHref;
    updateDropTarget(target ?? null);
  }

  function finishTabPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = pointerTabDrag.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (drag.active && dropTargetHrefRef.current) {
      reorderTabs(drag.sourceHref, dropTargetHrefRef.current);
    }

    pointerTabDrag.current = null;
    updateDropTarget(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  if (!hydrated || tabs.length === 0) return null;

  return (
    <nav aria-label="Open pages" className="fixed inset-x-0 bottom-0 z-40 px-2 pb-2 sm:px-4 sm:pb-3">
      <div className="nexa-workspace-bar mx-auto flex max-w-[1800px] items-center gap-2 rounded-2xl px-2 py-2 sm:px-3">
        <div className="relative shrink-0" ref={launcherRef}>
          <button
            type="button"
            aria-label={launcherOpen ? "Close app launcher" : "Open all apps"}
            aria-expanded={launcherOpen}
            aria-controls="nexa-app-launcher"
            onClick={() => setLauncherOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-accent"
          >
            <NexaLogo href="" showText={false} size="sm" />
          </button>
          {launcherOpen && (
            <section
              id="nexa-app-launcher"
              aria-label="All apps"
              className="absolute bottom-[calc(100%+0.75rem)] left-0 z-50 w-[min(25rem,calc(100vw-1rem))] rounded-2xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-2xl sm:w-[28rem]"
            >
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">All apps</h2>
                  <p className="text-xs text-muted-foreground">Open a tool in your workspace</p>
                </div>
                <button
                  type="button"
                  onClick={() => setLauncherOpen(false)}
                  aria-label="Close app launcher"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid max-h-[min(65vh,36rem)] grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                {APP_PAGES.map((page) => {
                  const Icon = page.icon;
                  const active = pathname === page.href;

                  return (
                    <button
                      key={page.href}
                      type="button"
                      title={page.title}
                      aria-current={active ? "page" : undefined}
                      onClick={() => {
                        setLauncherOpen(false);
                        router.push(page.href);
                      }}
                      className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-center text-xs transition ${active ? "nexa-nav-active" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="line-clamp-2">{page.title}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
        <div
          ref={tabStripRef}
          className="flex min-w-0 flex-1 snap-x snap-proximity touch-pan-x gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            const Icon = PAGE_ICONS[tab.href] ??
              AVAILABLE_TOOLS.find((tool) => tool.href === tab.href)?.icon ??
              House;

            return (
              <div
                key={tab.href}
                data-workspace-tab-href={tab.href}
                onAnimationEnd={(event) => {
                  if (event.target !== event.currentTarget || event.animationName !== "nexa-workspace-tab-close") return;
                  finishCloseRef.current(tab.href);
                }}
                onPointerMove={handleTabPointerMove}
                onPointerUp={finishTabPointerMove}
                onPointerCancel={(event) => {
                  if (pointerTabDrag.current?.pointerId === event.pointerId) {
                    pointerTabDrag.current = null;
                    updateDropTarget(null);
                  }
                }}
                className={`nexa-workspace-tab flex min-w-0 shrink-0 snap-start items-center rounded-xl ${active ? "nexa-workspace-tab-active" : ""} ${dropTargetHref === tab.href ? "ring-2 ring-primary/70" : ""} ${enteringHref === tab.href ? "nexa-workspace-tab-opening" : ""} ${closingHref === tab.href ? "nexa-workspace-tab-closing" : ""}`}
              >
                <button
                  type="button"
                  aria-label={`Reorder ${tab.title}. Drag left or right, or press Alt and an arrow key.`}
                  title={`Drag to reorder ${tab.title}`}
                  onPointerDown={(event) => {
                    if (event.button !== 0) return;
                    event.preventDefault();
                    pointerTabDrag.current = {
                      pointerId: event.pointerId,
                      sourceHref: tab.href,
                      startX: event.clientX,
                      active: false,
                    };
                    event.currentTarget.parentElement?.setPointerCapture(event.pointerId);
                  }}
                  onKeyDown={(event) => {
                    if (!event.altKey || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                    event.preventDefault();
                    const index = tabs.findIndex((item) => item.href === tab.href);
                    const target = tabs[index + (event.key === "ArrowLeft" ? -1 : 1)];
                    if (target) reorderTabs(tab.href, target.href);
                  }}
                  className="flex h-8 w-5 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground/55 transition hover:text-foreground focus-visible:text-foreground active:cursor-grabbing"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  ref={active ? activeTabRef : null}
                  onClick={() => router.push(tab.href)}
                  aria-current={active ? "page" : undefined}
                  className="flex min-w-0 items-center gap-2 px-3 py-2 text-left text-xs sm:text-sm"
                  title={tab.title}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="max-w-28 truncate sm:max-w-40">{tab.title}</span>
                </button>
                <button
                  type="button"
                  onClick={() => requestCloseTab(tab.href)}
                  aria-label={`Close ${tab.title}`}
                  disabled={closingHref !== null}
                  className="mr-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
