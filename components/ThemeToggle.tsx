"use client";

import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { toggle } = useTheme();

  return (
    <button
      className="theme-toggle"
      id="themeToggle"
      aria-label="Toggle light/dark mode"
      onClick={toggle}
    >
      <div className="theme-toggle-knob">
        <span className="material-symbols-outlined" id="themeIcon">
          light_mode
        </span>
      </div>
    </button>
  );
}
