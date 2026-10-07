"use client";

import { ArrowRight, Zap } from "lucide-react";

import { TubeClock } from "@/components/dashboard/TubeClock";
import { HeroBackground } from "@/components/dashboard/HeroBackground";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { emit } from "@/lib/events";

type AnimatedHeroProps = {
  toolCount: number;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  if (hour < 22) return "Good evening";
  return "Good night";
}

export function AnimatedHero({ toolCount }: AnimatedHeroProps) {
  const { settings } = useSettings();
  const name = settings.displayName.trim();

  return (
    <section
      id="home"
      className="nexa-home-hero relative isolate flex min-h-[calc(100svh-64px)] scroll-mt-20 items-center overflow-hidden"
    >
      <HeroBackground />

        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-2 px-5 pb-14 pt-12 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)] lg:px-8 lg:py-10 xl:px-12">
        <div className="relative z-20 max-w-[660px]">
          <p className="nexa-hero-enter nexa-home-muted mb-5 text-xs font-medium uppercase tracking-[0.19em] sm:text-sm">
            Your all-in-one productivity hub
          </p>

          <h1 className="nexa-hero-enter nexa-delay-1 nexa-home-text text-[clamp(3.2rem,7.5vw,6.7rem)] font-medium leading-[0.96] tracking-[-0.055em]">
            <span className="block">{getGreeting()},</span>
            <span className="nexa-orange-gradient block break-words">
              {name || "Probal Dhali"}
            </span>
          </h1>

          <p className="nexa-hero-enter nexa-home-muted nexa-delay-2 mt-6 max-w-[490px] text-base leading-7 sm:text-lg sm:leading-8">
            Everything you need to be more productive, all in one place. Simple. Fast. Powerful.
          </p>

          <button
            type="button"
            onClick={() => emit("command:center:open")}
            className="nexa-home-command nexa-hero-enter nexa-delay-3 mt-7 flex min-h-[62px] w-full max-w-[590px] items-center gap-4 rounded-full border py-2 pl-5 pr-2 text-left text-sm backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nexa-home-accent)] sm:mt-8 sm:pl-6"
            aria-label="Open Nexa command center"
          >
            <Zap className="nexa-home-accent h-5 w-5 shrink-0 fill-current" />
            <span className="min-w-0 flex-1 truncate">Ask anything or type a command...</span>
            <span className="nexa-home-accent-bg flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <ArrowRight className="h-5 w-5" />
            </span>
          </button>

          <div className="nexa-home-muted nexa-hero-enter nexa-delay-4 mt-5 flex items-center gap-2 text-xs sm:text-sm">
            <span className="nexa-home-status-dot h-2 w-2 rounded-full" />
            <span>{toolCount} tools ready</span>
            <span className="opacity-40">·</span>
            <span>Local-first workspace</span>
          </div>
        </div>

        <div className="relative z-10 mx-auto flex min-h-[300px] w-full max-w-[680px] items-center justify-center sm:min-h-[390px] lg:min-h-[520px]">
          <div className="nexa-clock-halo pointer-events-none absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="relative z-10 h-[300px] w-full max-w-[360px] sm:h-[410px] sm:max-w-[480px] lg:h-[500px] lg:max-w-[590px]">
            <TubeClock />
          </div>
        </div>
      </div>

    </section>
  );
}
