"use client";

import { useCallback, useEffect, useState } from "react";
import { useOverlayHistory } from "./useOverlayHistory";

/** Mirrors the `lg` SCSS breakpoint, above which the hamburger is hidden. */
const DESKTOP_QUERY = "(min-width: 901px)";

/**
 * Open state for the mobile menu. Closes itself if the viewport grows past the
 * hamburger breakpoint, so a hidden menu can't leave the page scroll-locked.
 *
 * `close` also pops the menu's history entry (see `useOverlayHistory`);
 * `dismiss` doesn't, for callers that replace that entry themselves.
 */
export function useHamburger(): {
  open: boolean;
  toggle: () => void;
  close: () => void;
  dismiss: () => void;
} {
  const [open, setOpen] = useState(false);
  const dismiss = useCallback(() => setOpen(false), []);
  const close = useOverlayHistory("menu", open, dismiss);
  const toggle = useCallback(() => (open ? close() : setOpen(true)), [open, close]);

  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) close();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, close]);

  return { open, toggle, close, dismiss };
}
