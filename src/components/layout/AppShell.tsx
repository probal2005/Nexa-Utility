"use client";

import Link from "next/link";
import {
  Bell,
  BellRing,
  Search,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { WorkspaceTabBar } from "@/components/layout/WorkspaceTabBar";
import { AppDock } from "@/components/layout/AppDock";
import { NexaLogo } from "@/components/brand/NexaLogo";
import { CommandPalette } from "@/components/command-bar/CommandPalette";
import { useNotifications } from "@/lib/notifications";
import { NotificationScheduler } from "@/components/notifications/NotificationScheduler";
import { AVAILABLE_TOOLS } from "@/config/tools";
import { emit } from "@/lib/events";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const pageTitle = pathname === "/"
    ? "Home"
    : AVAILABLE_TOOLS.find((tool) => tool.href === pathname)?.name ??
      ({
        "/settings": "Settings",
        "/profile": "Profile",
        "/privacy": "Privacy center",
        "/study": "Study tools",
      } as Record<string, string>)[pathname] ?? "Workspace";
  const { unreadCount } = useNotifications();
  const [notificationsHydrated, setNotificationsHydrated] = useState(false);

  useEffect(() => {
    setNotificationsHydrated(true);
  }, []);

  const showUnreadState = notificationsHydrated && unreadCount > 0;

  return (
    <div className={isHomePage ? "nexa-home-shell min-h-screen overflow-x-clip" : "min-h-screen min-w-0 overflow-x-clip bg-background text-foreground"}>
      <NotificationScheduler />
      <CommandPalette showLauncher={false} />
      <AppDock />

      <div className="min-w-0 overflow-x-clip lg:pl-24">
        <header className={`sticky top-0 z-30 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl ${
          isHomePage
            ? "nexa-home-header"
            : "bg-background/90 text-foreground"
        }`}>
          <div className="mx-auto flex h-16 min-w-0 max-w-[1800px] items-center justify-between gap-3 px-3 sm:px-5 lg:px-6">
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <NexaLogo
                size="sm"
                subtitle={isHomePage ? "Your utility workspace" : "Personal workspace"}
                className="max-w-[11rem] sm:max-w-none"
              />
              {!isHomePage && (
                <span className="hidden max-w-40 truncate border-l border-border pl-3 text-sm font-semibold sm:block">
                  {pageTitle}
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!isHomePage && (
                <button
                  type="button"
                  onClick={() => emit("command:center:open")}
                  className="hidden h-10 w-56 items-center gap-2 rounded-xl border border-border bg-card px-3 text-left text-sm text-muted-foreground transition hover:bg-accent md:flex lg:w-64"
                  aria-label="Search tools"
                >
                  <Search className="h-4 w-4" />
                  <span className="flex-1">Search tools</span>
                  <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
                </button>
              )}

              <button
                type="button"
                onClick={() => emit("command:center:open")}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
                aria-label="Search tools"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              <Link
                href="/notifications"
                aria-label={showUnreadState ? `${unreadCount} unread notifications` : "Notifications"}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition hover:bg-accent"
              >
                {showUnreadState ? <BellRing className="h-[18px] w-[18px]" /> : <Bell className="h-[18px] w-[18px]" />}
                {showUnreadState && (
                  <span className="absolute right-1.5 top-1.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/settings"
                aria-label="Settings"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition hover:bg-accent"
              >
                <Settings className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </header>

        <main
          key={pathname}
          className={`nexa-page-opening min-w-0 overflow-x-clip ${isHomePage ? "pb-0" : "pb-24"}`}
        >
          {children}
        </main>
      </div>

      <WorkspaceTabBar />
    </div>
  );
}

export default AppShell;
