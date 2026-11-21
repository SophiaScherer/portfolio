export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "portfolio-theme";
export const DARK_QUERY = "(prefers-color-scheme: dark)";

/** Each theme's page background, for the browser's `theme-color`. */
export const THEME_COLORS: Record<Theme, string> = { light: "#f9f4e8", dark: "#18181a" };

/**
 * Id of the `theme-color` meta the init script puts first in <head>. Browsers
 * use the first match, so it overrides the per-OS-scheme metas Next renders,
 * which would ignore a theme picked on the site. Those are left untouched:
 * React matches them by their attributes during hydration.
 */
const THEME_COLOR_META_ID = "theme-color";

/** Also moves the meta back to the front, in case React inserted metas before it. */
export function setThemeColor(theme: Theme): void {
  const meta = document.getElementById(THEME_COLOR_META_ID);
  if (!meta) return;
  meta.setAttribute("content", THEME_COLORS[theme]);
  if (document.head.firstElementChild !== meta) document.head.prepend(meta);
}

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
  var meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.id = ${JSON.stringify(THEME_COLOR_META_ID)};
  meta.content = ${JSON.stringify(THEME_COLORS)}[theme];
  document.head.prepend(meta);
})();`;
