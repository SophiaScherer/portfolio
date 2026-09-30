"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DARK_QUERY, THEME_STORAGE_KEY, type Theme } from "../lib/theme";

const listeners = new Set<() => void>();

function readStored(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  // Skip every element's color transition for the switch itself.
  root.dataset.themeSwitching = "";
  root.dataset.theme = theme;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => delete root.dataset.themeSwitching),
  );
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Follow the OS setting live until the visitor picks a theme themselves.
  const query = window.matchMedia(DARK_QUERY);
  const onSystemChange = () => {
    if (!readStored()) applyTheme(query.matches ? "dark" : "light");
  };
  query.addEventListener("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    query.removeEventListener("change", onSystemChange);
  };
}

/** The theme set on <html> by `THEME_INIT_SCRIPT`, kept in sync with toggles and the OS. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => "light",
  );

  const toggle = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage is blocked; the choice just won't persist.
    }
  }, [theme]);

  return { theme, toggle };
}
