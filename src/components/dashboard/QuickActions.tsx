'use client';

import Link from 'next/link';
import {
  Bell,
  Calculator,
  CalendarDays,
  Camera,
  Ruler,
  Clock3,
  FilePenLine,
} from 'lucide-react';

import { PremiumCard } from '@/components/ui/PremiumCard';

const actions = [
  {
    name: 'Calculator',
    description: 'Quick calculations',
    href: '/calculator',
    icon: Calculator,
  },
  {
    name: 'New Note',
    description: 'Write something down',
    href: '/notes',
    icon: FilePenLine,
  },
  {
    name: 'Timer',
    description: 'Start a countdown',
    href: '/clock',
    icon: Clock3,
  },
  {
    name: 'Calendar',
    description: 'Manage your schedule',
    href: '/calendar',
    icon: CalendarDays,
  },
  {
    name: 'Reminder',
    description: 'Create a reminder',
    href: '/reminders',
    icon: Bell,
  },
  {
    name: 'Camera',
    description: 'Capture a photo',
    href: '/camera',
    icon: Camera,
  },
  {
    name: 'Measure',
    description: 'Measure objects and distances',
    href: '/measure',
    icon: Ruler,
  },
];

export function QuickActions() {
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">
          Quick actions
        </h2>

        <p className="mt-1 text-xs text-zinc-600">
          Jump directly into your everyday tools.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.name}
              href={action.href}
              className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <PremiumCard className="h-full border border-white/[0.08] bg-white/[0.025] p-4">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-zinc-400 transition-colors duration-300 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
                  <Icon size={18} />
                </div>

                <p className="text-sm font-medium text-zinc-200 transition-colors duration-300 group-hover:text-white">
                  {action.name}
                </p>

                <p className="mt-1 text-xs text-zinc-600">
                  {action.description}
                </p>
              </PremiumCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
