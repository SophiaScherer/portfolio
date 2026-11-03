"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Plays the `.reveal` entrance for every element on the page as it scrolls
 * into view, so sections can stay server components. Runs again after each
 * client navigation.
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".reveal:not(.visible)");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      // Fires as soon as an element's top edge is slightly inside the screen,
      // so tall blocks (e.g. the timeline) don't wait for a share of their height.
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
