"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Camera,
  Check,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  MapPin,
  Pencil,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { on } from "@/lib/events";
import { useSettings } from "@/features/settings/hooks/useSettings";
import {
  DEFAULT_PROFILE,
  loadProfile,
  saveProfile,
  type NexaProfile,
} from "../lib/profile";
import { loadWorkspaceStats } from "../lib/workspace";

function getInitials(name: string): string {
  const trimmed = name.trim();

  if (!trimmed) {
    return "N";
  }

  return trimmed
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getProfileCompletion(
  profile: NexaProfile,
): number {
  const fields = [
    profile.displayName,
    profile.username,
    profile.role,
    profile.bio,
    profile.location,
    profile.website,
    profile.avatar,
  ];

  const completed = fields.filter(
    (value) => value.trim().length > 0,
  ).length;

  return Math.round(
    (completed / fields.length) * 100,
  );
}

function formatWebsite(website: string): string {
  return website
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

export default function ProfilePage() {
  const { settings, setDisplayName } =
    useSettings();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [profile, setProfile] =
    useState<NexaProfile>(DEFAULT_PROFILE);

  const [draft, setDraft] =
    useState<NexaProfile>(DEFAULT_PROFILE);

  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [hydrated, setHydrated] =
    useState(false);

  const [workspaceStats, setWorkspaceStats] =
    useState({
      notes: 0,
      tasks: 0,
      reminders: 0,
      calendarEvents: 0,
    });

  useEffect(() => {
    const loaded = loadProfile();

    const settingsName =
      settings.displayName?.trim() ?? "";

    const profileName =
      settingsName || loaded.displayName.trim();

    const merged: NexaProfile = {
      ...loaded,
      displayName: profileName,
    };

    setProfile(merged);
    setDraft(merged);
    setHydrated(true);

    // Migrate older profile-only names into the shared settings value.
    if (!settingsName && profileName) {
      setDisplayName(profileName);
    }
  }, [settings.displayName, setDisplayName]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const syncWorkspaceStats = () => {
      setWorkspaceStats(loadWorkspaceStats());
    };

    syncWorkspaceStats();

    const unsubscribeNotes =
      on("notes:changed", syncWorkspaceStats);

    const unsubscribeTasks =
      on("tasks:changed", syncWorkspaceStats);

    const unsubscribeReminders =
      on("reminders:changed", syncWorkspaceStats);

    const unsubscribeCalendar =
      on("calendar:changed", syncWorkspaceStats);

    return () => {
      unsubscribeNotes();
      unsubscribeTasks();
      unsubscribeReminders();
      unsubscribeCalendar();
    };
  }, [hydrated]);

  const completion = useMemo(
    () => getProfileCompletion(profile),
    [profile],
  );

  const initials = useMemo(
    () => getInitials(profile.displayName),
    [profile.displayName],
  );

  function startEditing() {
    setDraft(profile);
    setSaved(false);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setSaved(false);
    setEditing(false);
  }

  function updateDraft(
    field: keyof NexaProfile,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSave() {
    const nextProfile = {
      ...draft,
      displayName:
        draft.displayName.trim(),
      username:
        draft.username.trim().replace(/^@/, ""),
      role: draft.role.trim(),
      bio: draft.bio.trim(),
      location: draft.location.trim(),
      website: draft.website.trim(),
    };

    saveProfile(nextProfile);
    setProfile(nextProfile);

    if (
      nextProfile.displayName !==
      settings.displayName
    ) {
      setDisplayName(
        nextProfile.displayName,
      );
    }

    setDraft(nextProfile);
    setEditing(false);
    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function handleAvatarUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert(
        "Please choose an image smaller than 5 MB.",
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        return;
      }

      setDraft((current) => ({
        ...current,
        avatar: result,
      }));
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  function removeAvatar() {
    setDraft((current) => ({
      ...current,
      avatar: "",
    }));
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
      </div>
    );
  }

  const visibleProfile =
    editing ? draft : profile;

  return (
    <main className="min-w-0">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <UserRound className="h-4 w-4" />
              Profile
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Manage how you appear across your
              Nexa Utility workspace.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                Saved
              </div>
            )}

            {!editing ? (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
                Edit profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
                >
                  <Check className="h-4 w-4" />
                  Save changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile hero */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-blue-500/20 via-violet-500/10 to-cyan-500/10 sm:h-44">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
          </div>

          <div className="relative px-5 pb-6 sm:px-7">
            <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end">
              <div className="group relative shrink-0">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border-4 border-card bg-muted text-3xl font-semibold shadow-xl sm:h-32 sm:w-32">
                  {visibleProfile.avatar ? (
                    <Image
                      src={visibleProfile.avatar}
                      alt={`${visibleProfile.displayName || "Nexa User"} profile`}
                      width={128}
                      height={128}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="bg-gradient-to-br from-blue-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                      {initials}
                    </span>
                  )}
                </div>

                {editing && (
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background shadow-lg transition hover:bg-accent"
                      aria-label="Upload profile image"
                    >
                      <Camera className="h-4 w-4" />
                    </button>

                    {visibleProfile.avatar && (
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-red-400 shadow-lg transition hover:bg-red-500/10"
                        aria-label="Remove profile image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-semibold">
                    {visibleProfile.displayName ||
                      "Nexa User"}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                  {visibleProfile.username
                    ? `@${visibleProfile.username}`
                    : "Complete your username"}
                </p>

                <p className="mt-2 text-sm font-medium text-foreground/80">
                  {visibleProfile.role}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main grid */}
        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Left */}
          <div className="min-w-0 space-y-6">
            {/* About */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserRound className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold">
                    About
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Your personal information
                  </p>
                </div>
              </div>

              {editing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <ProfileField
                    label="Display name"
                    value={draft.displayName}
                    placeholder="Your name"
                    onChange={(value) =>
                      updateDraft(
                        "displayName",
                        value,
                      )
                    }
                  />

                  <ProfileField
                    label="Username"
                    value={draft.username}
                    placeholder="probal2005"
                    onChange={(value) =>
                      updateDraft(
                        "username",
                        value,
                      )
                    }
                  />

                  <ProfileField
                    label="Role"
                    value={draft.role}
                    placeholder="Software Engineer"
                    onChange={(value) =>
                      updateDraft(
                        "role",
                        value,
                      )
                    }
                  />

                  <ProfileField
                    label="Location"
                    value={draft.location}
                    placeholder="Punjab, India"
                    onChange={(value) =>
                      updateDraft(
                        "location",
                        value,
                      )
                    }
                  />

                  <div className="sm:col-span-2">
                    <ProfileField
                      label="Website"
                      value={draft.website}
                      placeholder="https://example.com"
                      onChange={(value) =>
                        updateDraft(
                          "website",
                          value,
                        )
                      }
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-2 block text-xs font-medium text-muted-foreground">
                        Bio
                      </span>

                      <textarea
                        value={draft.bio}
                        onChange={(event) =>
                          updateDraft(
                            "bio",
                            event.target.value,
                          )
                        }
                        maxLength={240}
                        rows={4}
                        placeholder="Tell us a little about yourself..."
                        className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                      />

                      <span className="mt-1 block text-right text-[11px] text-muted-foreground">
                        {draft.bio.length}/240
                      </span>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {profile.bio ||
                      "No bio added yet."}
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoItem
                      icon={Sparkles}
                      label="Role"
                      value={
                        profile.role ||
                        "Nexa Utility User"
                      }
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Location"
                      value={
                        profile.location ||
                        "Not specified"
                      }
                    />

                    <InfoItem
                      icon={UserRound}
                      label="Username"
                      value={
                        profile.username
                          ? `@${profile.username}`
                          : "Not specified"
                      }
                    />

                    <InfoItem
                      icon={ExternalLink}
                      label="Website"
                      value={
                        profile.website
                          ? formatWebsite(
                              profile.website,
                            )
                          : "Not specified"
                      }
                    />
                  </div>

                  {profile.website && (
                    <a
                      href={
                        profile.website.startsWith(
                          "http",
                        )
                          ? profile.website
                          : `https://${profile.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Visit website
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </section>

            {/* Workspace stats */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="font-semibold">
                  Workspace overview
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  A snapshot of your Nexa Utility activity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard
                  icon={FileText}
                  label="Notes"
                  value={workspaceStats.notes}
                />

                <StatCard
                  icon={Check}
                  label="Tasks"
                  value={workspaceStats.tasks}
                />

                <StatCard
                  icon={Sparkles}
                  label="Reminders"
                  value={workspaceStats.reminders}
                />

                <StatCard
                  icon={Sparkles}
                  label="Events"
                  value={workspaceStats.calendarEvents}
                />
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="mb-5">
                <h3 className="font-semibold">
                  Quick actions
                </h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  Jump directly to the places you use most.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <QuickAction
                  href="/settings"
                  icon={Settings}
                  title="Profile settings"
                  description="Customize your Nexa workspace"
                />

                <QuickAction
                  href="/notes"
                  icon={FileText}
                  title="Open notes"
                  description="Write and manage your notes"
                />

                <QuickAction
                  href="/photos"
                  icon={ImageIcon}
                  title="Open photos"
                  description="View your local photo workspace"
                />

                <QuickAction
                  href="/privacy"
                  icon={ShieldCheck}
                  title="Privacy center"
                  description="Review your local data controls"
                />
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="min-w-0 space-y-6">
            {/* Completion */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">
                    Profile completion
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Complete your profile to make it more useful.
                  </p>
                </div>

                <span className="text-2xl font-semibold">
                  {completion}%
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${completion}%`,
                  }}
                />
              </div>

              <div className="mt-4 space-y-2">
                <CompletionItem
                  label="Profile image"
                  complete={Boolean(
                    profile.avatar,
                  )}
                />

                <CompletionItem
                  label="Display name"
                  complete={Boolean(
                    profile.displayName.trim(),
                  )}
                />

                <CompletionItem
                  label="Username"
                  complete={Boolean(
                    profile.username.trim(),
                  )}
                />

                <CompletionItem
                  label="Bio"
                  complete={Boolean(
                    profile.bio.trim(),
                  )}
                />

                <CompletionItem
                  label="Location"
                  complete={Boolean(
                    profile.location.trim(),
                  )}
                />

                <CompletionItem
                  label="Website"
                  complete={Boolean(
                    profile.website.trim(),
                  )}
                />
              </div>
            </section>

            {/* Local-first card */}
            <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold">
                    Local-first profile
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Your profile information and
                    uploaded image are stored locally
                    in this browser.
                  </p>
                </div>
              </div>
            </section>

            {/* Settings */}
            <section className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Settings className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold">
                    Workspace settings
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Manage theme, app dock shortcuts,
                    notifications, and other preferences.
                  </p>

                  <Link
                    href="/settings"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    Open settings
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

function ProfileField({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-muted-foreground">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
      />
    </label>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-background/50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <span className="text-2xl font-semibold">
          {value}
        </span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function CompletionItem({
  label,
  complete,
}: {
  label: string;
  complete: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`flex h-5 w-5 items-center justify-center rounded-full ${
          complete
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {complete ? (
          <Check className="h-3 w-3" />
        ) : (
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
        )}
      </div>

      <span
        className={
          complete
            ? "text-foreground"
            : "text-muted-foreground"
        }
      >
        {label}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Settings;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-background/50 p-3 transition hover:border-primary/30 hover:bg-accent"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted transition group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {description}
        </p>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
    </Link>
  );
}
