"use client";

import { useEffect, useState } from "react";

export function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const updateClock = () => {
      setNow(new Date());
    };

    updateClock();

    const interval = window.setInterval(updateClock, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  return now;
}