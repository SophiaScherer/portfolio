"use client";

import { useEffect } from "react";

export function useNavActive(selector: string = ".nav-links a"): void {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(selector);
    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => {
            a.style.color = "";
            a.style.borderBottom = "";
          });
          const active = document.querySelector<HTMLAnchorElement>(
            `${selector}[href="#${entry.target.id}"]`
          );
          if (active) active.style.color = "var(--primary)";
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [selector]);
}
