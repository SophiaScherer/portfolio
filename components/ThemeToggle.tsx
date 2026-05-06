"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const stored = localStorage.getItem("theme");
    const initialDark = stored ? stored === "dark" : prefersDark;
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <button
        className="w-13 h-7 bg-switch-track rounded-full relative flex items-center p-0.5 transition-colors"
        aria-label="Toggle theme"
      >
        <div className="w-5.5 h-5.5 bg-switch-knob rounded-full shadow-md transition-transform" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-13 h-7 bg-switch-track rounded-full relative flex items-center p-0.5 transition-colors"
      aria-label="Toggle light/dark mode"
    >
      <div
        className={`w-5.5 h-5.5 bg-switch-knob rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
          isDark ? "translate-x-6" : ""
        }`}
      >
        <span className="material-symbols-outlined text-3.5" style={{ color: isDark ? "var(--switch-icon-d)" : "var(--switch-icon-l)", fontSize: "14px" }}>
          {isDark ? "dark_mode" : "light_mode"}
        </span>
      </div>
    </button>
  );
}
