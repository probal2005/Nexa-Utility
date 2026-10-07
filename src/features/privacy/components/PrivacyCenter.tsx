"use client";

import {
  Database,
  Eye,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { PermissionCard } from "./PermissionCard";
import { usePermissions } from "../hooks/usePermissions";

export function PrivacyCenter() {
  const {
    permissions,
    loading,
    requesting,
    request,
    refresh,
    toggle,
  } = usePermissions();

  const granted = permissions.filter(
    (permission) => permission.state === "granted",
  ).length;

  const blocked = permissions.filter(
    (permission) => permission.state === "denied",
  ).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--nexa-accent)]/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--nexa-accent)]/20 bg-[var(--nexa-accent)]/10 px-3 py-1.5 text-xs font-medium text-[var(--nexa-accent)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Privacy Center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your privacy, your control.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage the permissions Nexa Utility uses for cameras,
              notifications, microphone, and location-aware features.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-background/50 p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <LockKeyhole className="h-4 w-4" />
              <span className="text-xs">Permissions</span>
            </div>
            <p className="mt-2 text-2xl font-bold">
              {permissions.length}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs">Allowed</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{granted}</p>
          </div>

          <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
            <div className="flex items-center gap-2 text-red-400">
              <Eye className="h-4 w-4" />
              <span className="text-xs">Blocked</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{blocked}</p>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Nexa only requests access when a feature needs it.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-3xl border border-border/60 bg-card/50"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {permissions.map((permission) => (
              <PermissionCard
                key={permission.id}
                permission={permission}
                requesting={requesting === permission.id}
                onRequest={() => void request(permission.id)}
                onDisable={() => toggle(permission.id)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card/60 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--nexa-accent)]/10 text-[var(--nexa-accent)]">
            <Database className="h-5 w-5" />
          </div>

          <h2 className="mt-4 font-semibold">Local-first data</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Nexa Utility stores many preferences and productivity
            records locally in your browser. Your data stays under
            your control unless a feature explicitly uses an external
            service.
          </p>
        </div>

        <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <Trash2 className="h-5 w-5" />
          </div>

          <h2 className="mt-4 font-semibold">Data controls</h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Data deletion controls will be connected here to Nexa&apos;s
            unified storage system so you can manage local application
            data from one place.
          </p>
        </div>
      </section>
    </div>
  );
}
