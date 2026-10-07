"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Settings,
  X,
} from "lucide-react";

import { NexaLogo } from "@/components/brand/NexaLogo";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { emit } from "@/lib/events";
import { AVAILABLE_TOOLS, TOOL_CATEGORIES } from "@/config/tools";

type SidebarProps = {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onNavigate?: () => void;
};

function NavItem({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={[
        "flex min-w-0 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "nexa-nav-active"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      <Icon className={`h-[18px] w-[18px] shrink-0 ${active ? "nexa-nav-active-icon" : ""}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>

      <div className="space-y-1">{children}</div>
    </section>
  );
}

function SidebarContent({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { settings } = useSettings();

  const isActive = (href: string) => {
    const hasExactToolRoute = AVAILABLE_TOOLS.some((tool) => tool.href === pathname);
    return pathname === href || (pathname.startsWith(`${href}/`) && !hasExactToolRoute);
  };

  const displayName = settings.displayName?.trim() || "Nexa User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-3 px-4 py-4">
        <NexaLogo showText={false} className="h-8 w-8 shrink-0" />

        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">
            Nexa Utility
          </div>

          <div className="truncate text-[11px] text-muted-foreground">
            Personal workspace
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav aria-label="Primary navigation">
          <div className="space-y-1 pt-3">
            <NavItem
              href="/"
              label="Home"
              icon={Home}
              active={pathname === "/"}
              onNavigate={onNavigate}
            />
          </div>

          <button
            type="button"
            onClick={() => emit("command:center:open")}
            className="mt-3 flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <Search className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">Search tools</span>
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
          </button>

          {TOOL_CATEGORIES.map((category) => {
            const categoryTools = AVAILABLE_TOOLS.filter(
              (tool) => tool.category === category.id,
            );

            if (categoryTools.length === 0) return null;

            return (
              <Section key={category.id} title={category.name}>
                {categoryTools.map((tool) => (
                  <NavItem
                    key={tool.id}
                    href={tool.href}
                    label={tool.name}
                    icon={tool.icon}
                    active={isActive(tool.href)}
                    onNavigate={onNavigate}
                  />
                ))}
              </Section>
            );
          })}
        </nav>
      </div>

      <div className="shrink-0 bg-background p-3 shadow-[0_-8px_20px_rgba(0,0,0,0.12)]">
        <Link
          href="/profile"
          onClick={onNavigate}
          className={[
            "group mb-2 flex min-w-0 items-center gap-2.5 rounded-xl border p-2.5 transition-colors",
            isActive("/profile")
              ? "nexa-nav-active border-transparent"
              : "border-border bg-card hover:bg-accent/60",
          ].join(" ")}
          aria-label="Open profile"
          aria-current={isActive("/profile") ? "page" : undefined}
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${isActive("/profile") ? "nexa-nav-active-icon bg-accent/20" : "bg-accent"}`}>
            {initial}
          </div>

          <div className="min-w-0 flex-1">
            <div className="break-words text-sm font-medium">
              {displayName}
            </div>

            <div className="whitespace-nowrap text-xs text-muted-foreground">
              Personal workspace
            </div>
          </div>
        </Link>

        <NavItem
          href="/settings"
          label="Settings"
          icon={Settings}
          active={isActive("/settings")}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

export default function Sidebar({
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 bg-background shadow-[8px_0_28px_rgba(0,0,0,0.14)] lg:flex lg:flex-col">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onMobileClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="mobile-navigation"
        className={[
          "fixed inset-y-0 left-0 z-[60] flex w-[min(20rem,calc(100vw-2rem))] flex-col bg-background shadow-2xl transition-transform duration-200 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </aside>
    </>
  );
}
