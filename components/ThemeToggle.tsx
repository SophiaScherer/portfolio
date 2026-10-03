"use client";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  // Both icons render and CSS shows the one for the current theme, so the
  // server HTML is right before hydration.
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label="Dark mode"
      aria-pressed={theme === "dark"}
      onClick={toggle}
    >
      <span className="theme-toggle-knob" aria-hidden="true">
        <span className="material-symbols-outlined theme-icon-light">light_mode</span>
        <span className="material-symbols-outlined theme-icon-dark">dark_mode</span>
      </span>
    </button>
  );
}
