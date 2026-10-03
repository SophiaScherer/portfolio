export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Runs in <head> before first paint, so dark-mode visitors never see the light
 * theme flash in. Also marks the page as scripted, which lets entrance
 * animations hide content that would otherwise stay invisible without JS.
 * Storage can throw when site data is blocked, so it falls back to the OS.
 */
export const THEME_INIT_SCRIPT = `(function () {
  var root = document.documentElement;
  root.dataset.js = "";
  var theme;
  try { theme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch (e) {}
  if (theme !== "light" && theme !== "dark") {
    theme = matchMedia(${JSON.stringify(DARK_QUERY)}).matches ? "dark" : "light";
  }
  root.dataset.theme = theme;
})();`;
