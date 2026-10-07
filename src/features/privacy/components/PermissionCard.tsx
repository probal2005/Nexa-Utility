"use client";

import {
  Bell,
  Camera,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Loader2,
  LockKeyhole,
  MapPin,
  Mic,
  ShieldAlert,
  ShieldOff,
  XCircle,
} from "lucide-react";

import type {
  NexaPermission,
  NexaPermissionState,
} from "../types";

type PermissionCardProps = {
  permission: NexaPermission;
  requesting: boolean;
  onRequest: () => void;
  onDisable?: () => void;
};

const icons = {
  bell: Bell,
  camera: Camera,
  mic: Mic,
  "map-pin": MapPin,
};

const stateConfig: Record<
  NexaPermissionState,
  {
    label: string;
    className: string;
    Icon: typeof CheckCircle2;
  }
> = {
  granted: {
    label: "Allowed",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    Icon: CheckCircle2,
  },
  denied: {
    label: "Blocked",
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
    Icon: XCircle,
  },
  prompt: {
    label: "Not allowed yet",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
    Icon: ShieldAlert,
  },
  unsupported: {
    label: "Not supported",
    className:
      "border-border bg-muted/50 text-muted-foreground",
    Icon: HelpCircle,
  },
  unknown: {
    label: "Unknown",
    className:
      "border-border bg-muted/50 text-muted-foreground",
    Icon: HelpCircle,
  },
};

export function PermissionCard({
  permission,
  requesting,
  onRequest,
  onDisable,
}: PermissionCardProps) {
  const Icon =
    icons[permission.icon as keyof typeof icons] ??
    LockKeyhole;

  const state = stateConfig[permission.state];
  const StateIcon = state.Icon;

  const canRequest =
    permission.state === "prompt" ||
    permission.state === "unknown";

  const isGranted =
    permission.state === "granted";

  const isBlocked =
    permission.state === "denied";

  const isUnsupported =
    permission.state === "unsupported";

  const nexaEnabled =
    permission.nexaEnabled !== false;

  return (
    <div className="group rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-border hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition",
              nexaEnabled
                ? "bg-[var(--nexa-accent)]/10 text-[var(--nexa-accent)]"
                : "bg-muted text-muted-foreground",
            ].join(" ")}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">
              {permission.name}
            </h3>

            <div
              className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${state.className}`}
            >
              <StateIcon className="h-3 w-3" />
              {state.label}
            </div>

            {isGranted && (
              <p className="mt-1 text-[11px] text-muted-foreground">
                {nexaEnabled
                  ? "Nexa access is ON"
                  : "Nexa access is OFF"}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isGranted && onDisable && (
            <button
              type="button"
              onClick={onDisable}
              className={[
                "rounded-xl border px-3 py-2 text-xs font-medium transition",
                nexaEnabled
                  ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                  : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10",
              ].join(" ")}
            >
              {nexaEnabled ? (
                <span className="flex items-center gap-1.5">
                  <ShieldOff className="h-3.5 w-3.5" />
                  Turn Off
                </span>
              ) : (
                "Turn On"
              )}
            </button>
          )}

          {canRequest && (
            <button
              type="button"
              onClick={onRequest}
              disabled={requesting}
              className="shrink-0 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              {requesting ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Requesting
                </span>
              ) : (
                "Allow"
              )}
            </button>
          )}

          {isBlocked && (
            <button
              type="button"
              onClick={() => {
                window.open(
                  "chrome://settings/content",
                  "_blank",
                );
              }}
              className="shrink-0 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition hover:bg-accent"
            >
              <span className="flex items-center gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" />
                Manage
              </span>
            </button>
          )}

          {isUnsupported && (
            <span className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              Unavailable
            </span>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {permission.description}
      </p>

      <div className="mt-4 border-t border-border/60 pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Used by
        </p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {permission.usedBy.map((tool) => (
            <span
              key={tool}
              className="rounded-lg bg-muted/70 px-2 py-1 text-[11px] text-muted-foreground"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
