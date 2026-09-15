"use client";

import { useEffect, useState } from "react";

/* A thin band just above the middle of the viewport. A section is active while
   it crosses the band, which also works for sections taller than the screen. */
const ACTIVE_BAND = "-40% 0px -59% 0px";

/** Returns the id of the section currently in view, or null before any match. */
export function useNavActive(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((s): s is HTMLElement => s !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: ACTIVE_BAND }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
