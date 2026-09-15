"use client";

import { useCallback, useEffect, useState } from "react";

/** Mirrors the `lg` SCSS breakpoint, above which the hamburger is hidden. */
const DESKTOP_QUERY = "(min-width: 901px)";

/**
 * Open state for the mobile menu. Closes itself if the viewport grows past the
 * hamburger breakpoint, so a hidden menu can't leave the page scroll-locked.
 */
export function useHamburger(): {
  open: boolean;
  toggle: () => void;
  close: () => void;
} {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, close]);

  return { open, toggle, close };
}
