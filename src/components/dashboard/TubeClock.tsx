"use client";

import { useEffect, useState } from "react";

function readTime() {
  const now = new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
}

function readDate() {
  const now = new Date();

  return {
    weekday: new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(now),
    date: new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now),
  };
}

export function TubeClock() {
  const [time, setTime] = useState("--:--:--");
  const [date, setDate] = useState({ weekday: "", date: "" });

  useEffect(() => {
    const update = () => {
      setTime(readTime());
      setDate(readDate());
    };
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const groups = time.split(":");

  return (
    <div
      className="nexa-nixie-clock mx-auto flex h-full w-full items-center justify-center"
      role="timer"
      aria-label={`Local time ${time}`}
    >
      <div className="relative w-full max-w-[610px] px-2 pb-16 pt-8 sm:px-4 sm:pb-20">
        <div className="nexa-nixie-halo absolute inset-x-[8%] bottom-[20%] top-[14%] rounded-full" />

        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
          {groups.map((group, groupIndex) => (
            <div key={`${groupIndex}-${group}`} className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {group.split("").map((digit, digitIndex) => (
                <span
                  key={`${groupIndex}-${digitIndex}`}
                  className="nexa-nixie-tube"
                  aria-hidden="true"
                >
                  <span>{digit}</span>
                </span>
              ))}
              {groupIndex < groups.length - 1 && (
                <span className="nexa-nixie-colon" aria-hidden="true">:</span>
              )}
            </div>
          ))}
        </div>

        <div className="nexa-nixie-platform relative z-10 mx-auto mt-4 h-12 w-[98%] rounded-[1.15rem] sm:mt-5 sm:h-14">
          <div className="nexa-nixie-platform-top absolute inset-x-3 top-0 h-2 rounded-full" />
          <div className="nexa-nixie-platform-foot absolute -bottom-5 inset-x-[7%] h-6 rounded-b-[1.2rem]" />
        </div>

        <div className="nexa-home-live-badge nexa-home-text relative z-20 mx-auto mt-1 flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs">
          <span className="nexa-home-live-dot h-2 w-2 rounded-full" />
          <span className="font-semibold tracking-wide">LIVE</span>
          <span className="opacity-40">·</span>
          <span className="nexa-home-accent">LOCAL TIME</span>
        </div>

        <div
          className="nexa-home-date relative z-10 mx-auto mt-4 w-fit min-w-[min(100%,15rem)] rounded-xl border px-6 py-3 text-center text-[var(--nexa-home-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_12px_28px_rgba(0,0,0,0.16)] backdrop-blur-md"
          aria-label={`Today is ${date.weekday}, ${date.date}`}
        >
          <p className="nexa-home-accent text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
            {date.weekday || " "}
          </p>
          <p className="mt-1 text-sm font-medium tracking-wide opacity-90 sm:text-base">
            {date.date || " "}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TubeClock;
